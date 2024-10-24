import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';

let nbBalls = 3;

const Three3 = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const sphereBodiesRef = useRef<CANNON.Body[]>([]);
    const spheresRef = useRef<THREE.Mesh[]>([]);
    const controllableSphereRef = useRef<THREE.Mesh | null>(null);
    const controllableBodyRef = useRef<CANNON.Body | null>(null);
    const pressedKeys = useRef<Set<string>>(new Set());
    const speedLimit = 10;
    const acceleration = 2;
    const deceleration = 1;

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        if (canvasRef.current) {
            canvasRef.current.appendChild(renderer.domElement);
        }

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enabled = true;

        const textures = [
            new THREE.TextureLoader().load('skins/BasketballColor.jpg'),
            new THREE.TextureLoader().load('skins/NewTennisBallColor.jpg'),
            new THREE.TextureLoader().load('skins/SoftballColor.jpg')
        ];

        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

        for (let i = 0; i < nbBalls; i++) {
            const texture = textures[Math.floor(Math.random() * textures.length)];
            const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(Math.random() * 10 - 5, 2, Math.random() * 10 - 5);
            scene.add(sphere);
            spheresRef.current.push(sphere);
        }

        const controllableTexture = new THREE.TextureLoader().load('skins/polboule.png');
        const controllableMaterial = new THREE.MeshBasicMaterial({ map: controllableTexture });
        const controllableSphere = new THREE.Mesh(sphereGeometry, controllableMaterial);
        controllableSphere.position.set(0, 2, 0);
        scene.add(controllableSphere);
        controllableSphereRef.current = controllableSphere;

        const platformTexture = new THREE.TextureLoader().load('floor.jpg');
        const platformGeometry = new THREE.PlaneGeometry(40, 40);
        const platformMaterial = new THREE.MeshBasicMaterial({ map: platformTexture });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.set(0, -1, 0);
        platform.rotation.x = -Math.PI / 2;
        scene.add(platform);

        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);

        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);

        const sphereShape = new CANNON.Sphere(1);
        const friction = 0.3;

        for (let i = 0; i < nbBalls; i++) {
            const sphereBody = new CANNON.Body({ mass: 10, position: new CANNON.Vec3(Math.random() * 10 - 5, 2, Math.random() * 10 - 5), material: new CANNON.Material({ friction }) });
            sphereBody.addShape(sphereShape);
            world.addBody(sphereBody);
            sphereBodiesRef.current.push(sphereBody);
        }

        const controllableBody = new CANNON.Body({ mass: 10, position: new CANNON.Vec3(0, 2, 0), material: new CANNON.Material({ friction }) });
        controllableBody.addShape(sphereShape);
        world.addBody(controllableBody);
        controllableBodyRef.current = controllableBody;

        const platformShape = new CANNON.Box(new CANNON.Vec3(20, 0.5, 20));
        const platformBody = new CANNON.Body({ mass: 0 });
        platformBody.addShape(platformShape);
        platformBody.position.set(0, -1, 0);
        world.addBody(platformBody);

        const handleKeyDown = (event: KeyboardEvent) => {
            pressedKeys.current.add(event.code);
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            pressedKeys.current.delete(event.code);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const updatePhysics = () => {
            world.step(1 / 60);

            const resetHeight = -10;
            sphereBodiesRef.current.forEach((sphereBody, index) => {
                if (sphereBody.position.y < resetHeight) {
                    sphereBody.position.set(Math.random() * 10 - 5, 2, Math.random() * 10 - 5);
                    sphereBody.velocity.set(0, 0, 0);
                }
            });

            if (controllableBodyRef.current) {
                const controllableBody = controllableBodyRef.current;
                const direction = new CANNON.Vec3(0, 0, 0);
                const currentSpeed = controllableBody.velocity.length();

                if (pressedKeys.current.has('ArrowUp')) {
                    direction.z -= 1;
                }
                if (pressedKeys.current.has('ArrowDown')) {
                    direction.z += 1;
                }
                if (pressedKeys.current.has('ArrowLeft')) {
                    direction.x -= 1;
                }
                if (pressedKeys.current.has('ArrowRight')) {
                    direction.x += 1;
                }

                direction.normalize();

                if (direction.length() > 0) {
                    if (currentSpeed < speedLimit) {
                        controllableBody.velocity.x += direction.x * acceleration;
                        controllableBody.velocity.z += direction.z * acceleration;
                    }
                } else if (currentSpeed > 0) {
                    controllableBody.velocity.x *= (1 - deceleration * 0.01);
                    controllableBody.velocity.z *= (1 - deceleration * 0.01);
                }

                controllableBody.velocity.x = Math.max(-speedLimit, Math.min(speedLimit, controllableBody.velocity.x));
                controllableBody.velocity.z = Math.max(-speedLimit, Math.min(speedLimit, controllableBody.velocity.z));

                if (controllableBody.position.y < resetHeight) {
                    controllableBody.position.set(0, 2, 0);
                    controllableBody.velocity.set(0, 0, 0);
                }

                if (controllableSphereRef.current) {
                    controllableSphereRef.current.position.copy(controllableBody.position);
                    controllableSphereRef.current.quaternion.copy(controllableBody.quaternion);
                }
            }

            sphereBodiesRef.current.forEach((sphereBody, index) => {
                if (spheresRef.current[index]) {
                    spheresRef.current[index].position.copy(sphereBody.position);
                    spheresRef.current[index].quaternion.copy(sphereBody.quaternion);
                }
            });

            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(updatePhysics);
        };

        updatePhysics();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            renderer.dispose();
            if (canvasRef.current) {
                canvasRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={canvasRef} />;
};

export default Three3;
