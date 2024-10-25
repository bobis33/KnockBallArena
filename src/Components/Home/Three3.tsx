import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { animate } from 'framer-motion';

export default function Three3() { 

    const canvasRef = useRef<HTMLDivElement>(null);
    const sphereBodiesRef = useRef<CANNON.Body[]>([]);
    const spheresRef = useRef<THREE.Mesh[]>([]);
    const controllableSphereRef = useRef<THREE.Mesh | null>(null);
    const controllableBodyRef = useRef<CANNON.Body | null>(null);
    const textMesh = new THREE.Mesh();
    const textBodyRef = useRef<CANNON.Body | null>(null);
    const pressedKeys = useRef<Set<string>>(new Set());

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        if (canvasRef.current) {
            canvasRef.current.appendChild(renderer.domElement);
        }

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.maxPolarAngle = Math.PI / 3;
        controls.maxAzimuthAngle = 0;
        controls.minAzimuthAngle = 0;
        controls.enableDamping = true;
        controls.minDistance = 10;
        controls.maxDistance = 30;
        controls.enablePan = false;

        //background

        // Charger la texture de ciel
        const loader = new THREE.TextureLoader();
        const skyTexture = loader.load('space.png');

        // Ajout de texte 3D
        const fontLoader = new FontLoader();
        fontLoader.load('font.json', (font) => {
            const textGeometry = new TextGeometry('Comming Soon...', {
                font: font,
                size: 1,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.05,
                bevelOffset: 0,
                bevelSegments: 5
            });
            
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(-6.5, -0.57, 4);
            textMesh.rotation.set(-Math.PI / 3, 0, Math.PI / 8);
            textMesh.scale.set(1.4, 1.2, 1.2);
            scene.add(textMesh);
        
            // Créer un corps physique pour le texte
            const textShape = new CANNON.Box(new CANNON.Vec3(1.5, 0.1, 0.5)); // Ajustez la taille
            const textBody = new CANNON.Body({ mass: 1 });
            textBody.addShape(textShape);
            textBody.position.set(-3, 1, 0); // Utilisez `set` pour définir la position
            world.addBody(textBody);
        
            textBodyRef.current = textBody;
        });
        

        // Créer une sphère géante pour le ciel
        const skyGeometry = new THREE.SphereGeometry(500, 60, 40);
        const skyMaterial = new THREE.MeshBasicMaterial({
            map: skyTexture,
            side: THREE.BackSide
        });
        const skySphere = new THREE.Mesh(skyGeometry, skyMaterial);
        scene.add(skySphere);

        // Vitesse de rotation de la sphère
        const rotationSpeed = 0.0005;

        const textures = [
            new THREE.TextureLoader().load('skins/BasketballColor.jpg'),
            new THREE.TextureLoader().load('skins/NewTennisBallColor.jpg'),
            new THREE.TextureLoader().load('skins/SoftballColor.jpg')
        ];

        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const controllableTexture = new THREE.TextureLoader().load('skins/BasketballColor.jpg');
        const controllableMaterial = new THREE.MeshBasicMaterial({ map: controllableTexture });
        const controllableSphere = new THREE.Mesh(sphereGeometry, controllableMaterial);
        controllableSphere.position.set(4.9, 0.8, -1);
        controllableSphere.scale.set(1.3, 1.3, 1.3);
        scene.add(controllableSphere);
        controllableSphereRef.current = controllableSphere;

        //MAP
        const platformTexture = new THREE.TextureLoader().load('floor.jpg');
        const platformGeometry = new THREE.PlaneGeometry(15, 15);
        const platformMaterial = new THREE.MeshBasicMaterial({ map: platformTexture });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.set(0, -0.5, 0);
        platform.rotation.x = -Math.PI / 2;
        scene.add(platform);

        const Shape1Texture = new THREE.TextureLoader().load('floor.jpg', (texture) => {
            const Shape1Material = new THREE.MeshBasicMaterial({ 
                map: texture, 
                side: THREE.DoubleSide
            });
            const Shape1Geometry = new THREE.BoxGeometry(15, 1, 15);
            const Shape1 = new THREE.Mesh(Shape1Geometry, Shape1Material);
            Shape1.position.set(0, -1, 0);
            scene.add(Shape1);
        });
        
        camera.position.set(0, 8, 10);
        camera.lookAt(0, 0, 0);

        const world = new CANNON.World();
        world.gravity.set(0, -100, 0);

        const sphereShape = new CANNON.Sphere(1);
        const friction = 0.3;

        const controllableBody = new CANNON.Body({ mass: 10, position: new CANNON.Vec3(4.9, 0.8, -1), material: new CANNON.Material({ friction }) });
        controllableBody.addShape(sphereShape);
        world.addBody(controllableBody);
        controllableBodyRef.current = controllableBody;

        const textShape = new CANNON.Box(new CANNON.Vec3(1.5, 0.1, 0.5));
        const textBody = new CANNON.Body({ mass: 1 });
        textBody.addShape(textShape);
        textBody.position.set(-3, 1, 0);
        //rotation
        textBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
        world.addBody(textBody);

        //MAP
        const platformShape = new CANNON.Box(new CANNON.Vec3(7.5, 0.5, 7.5));
        const platformBody = new CANNON.Body({ mass: 0 });
        platformBody.addShape(platformShape);
        platformBody.position.set(0, -1, 0);
        world.addBody(platformBody);
        //

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

            if (textBodyRef.current) {
                const textBody = textBodyRef.current;
                textMesh.position.copy(textBody.position);
                textMesh.quaternion.copy(textBody.quaternion);
            }            

            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(updatePhysics);
        };

        function animate() {
            requestAnimationFrame(animate);
            skySphere.position.copy(camera.position);
            skySphere.rotation.y += rotationSpeed; // Faire tourner la sphère
            controls.update();
            renderer.render(scene, camera);
        }

        updatePhysics();
        animate();

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