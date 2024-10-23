import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';

let nbBalls = 50;

const Three = () => {
    const canvasRef = useRef(null);
    const sphereBodiesRef = useRef([]); // Références aux corps des sphères
    const spheresRef = useRef([]); // Références aux sphères Three.js

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasRef.current.appendChild(renderer.domElement);

        // Ajout des contrôles orbitaux
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enabled = true; // Activer les contrôles d'orbite
        controls.enableRotate = true;
        controls.enableZoom = true;
        controls.enablePan = true;

        // Charger plusieurs textures pour les sphères
        const textures = [
            new THREE.TextureLoader().load('skins/BasketballColor.jpg'),
            new THREE.TextureLoader().load('skins/NewTennisBallColor.jpg'),
            new THREE.TextureLoader().load('skins/SoftballColor.jpg')
        ];

        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

        // Créer les sphères
        for (let i = 0; i < nbBalls; i++) {
            const texture = textures[Math.floor(Math.random() * textures.length)];
            const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(Math.random() * 10 - 5, 2, Math.random() * 10 - 5);
            scene.add(sphere);
            spheresRef.current.push(sphere);
        }

        // Charger une texture d'image pour la plateforme
        const platformTexture = new THREE.TextureLoader().load('floor.jpg');
        const platformGeometry = new THREE.PlaneGeometry(40, 40);
        const platformMaterial = new THREE.MeshBasicMaterial({ map: platformTexture });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.set(0, -1, 0);
        platform.rotation.x = -Math.PI / 2;
        scene.add(platform);

        // Création de murs
        const wallGeometry = new THREE.BoxGeometry(20, 40, 2);
        const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0 });
        const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
        wall1.position.set(0, 0, -10);
        scene.add(wall1);

        const wallGeometry2 = new THREE.BoxGeometry(20, 40, 2);
        const wall2 = new THREE.Mesh(wallGeometry2, wallMaterial);
        wall2.position.set(0, 0, 10);
        scene.add(wall2);

        const wallGeometry3 = new THREE.BoxGeometry(40, 40, 2);
        const wall3 = new THREE.Mesh(wallGeometry3, wallMaterial);
        wall3.position.set(-10, 0, 0);
        wall3.rotation.y = Math.PI / 2;
        scene.add(wall3);

        const wall4 = new THREE.Mesh(wallGeometry3, wallMaterial);
        wall4.position.set(10, 0, 0);
        wall4.rotation.y = Math.PI / 2;
        scene.add(wall4);

        // Ajout du toit
        const roofGeometry = new THREE.PlaneGeometry(40, 40);
        const roofMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(0, 20, 0);
        roof.rotation.x = Math.PI / 2;
        scene.add(roof);

        // Configuration de la caméra
        camera.position.set(0, 5, 3); // Baisser la caméra initiale
        camera.lookAt(0, 0, 0);

        // Initialiser le monde physique
        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);

        // Créer des corps physiques pour les sphères
        const sphereShape = new CANNON.Sphere(1);
        for (let i = 0; i < nbBalls; i++) {
            const sphereBody = new CANNON.Body({ mass: 1, shape: sphereShape });
            sphereBody.position.set(Math.random() * 10 - 5, 2, Math.random() * 10 - 5);
            world.addBody(sphereBody);
            sphereBodiesRef.current.push(sphereBody);
        }

        // Créer un corps physique pour la plateforme
        const platformShape = new CANNON.Box(new CANNON.Vec3(20, 0.5, 20));
        const platformBody = new CANNON.Body({ mass: 0, shape: platformShape });
        platformBody.position.set(0, -1, 0);
        world.addBody(platformBody);

        // Créer des corps physiques pour les murs
        const wallShape = new CANNON.Box(new CANNON.Vec3(10, 20, 1));
        const wallBody1 = new CANNON.Body({ mass: 0, shape: wallShape });
        wallBody1.position.set(0, 0, -10);
        world.addBody(wallBody1);

        const wallBody2 = new CANNON.Body({ mass: 0, shape: wallShape });
        wallBody2.position.set(0, 0, 10);
        world.addBody(wallBody2);

        const wallBody3 = new CANNON.Body({ mass: 0, shape: wallShape });
        wallBody3.position.set(-11, 0, -2.5);
        wallBody3.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
        world.addBody(wallBody3);

        const wallBody4 = new CANNON.Body({ mass: 0, shape: wallShape });
        wallBody4.position.set(11, 0, -2.5);
        wallBody4.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
        world.addBody(wallBody4);

        // Créer un corps physique pour le toit
        const roofShape = new CANNON.Box(new CANNON.Vec3(20, 0.5, 20));
        const roofBody = new CANNON.Body({ mass: 0, shape: roofShape });
        roofBody.position.set(0, 20, 0);
        world.addBody(roofBody);

        // Appliquer des impulsions aléatoires aux sphères
        const applyRandomImpulse = (body) => {
            const impulse = new CANNON.Vec3(
                (Math.random() - 0.5) * 10,
                0,
                (Math.random() - 0.5) * 10
            );
            body.applyImpulse(impulse, body.position);
        };

        // Appliquer des impulsions toutes les deux secondes
        const intervalId = setInterval(() => {
            sphereBodiesRef.current.forEach(applyRandomImpulse);
        }, 500);

        // Mise à jour de la physique
        const updatePhysics = () => {
            world.step(1 / 60);

            // Réinitialisation de la position si une sphère tombe en dessous d'une certaine hauteur
            const resetHeight = -10;
            sphereBodiesRef.current.forEach((sphereBody, index) => {
                if (sphereBody.position.y < resetHeight) {
                    sphereBody.position.set(Math.random() * 10 - 5, 2, Math.random() * 10 - 5);
                    sphereBody.velocity.set(0, 0, 0);
                    sphereBody.angularVelocity.set(0, 0, 0);
                    applyRandomImpulse(sphereBody);
                }

                // Copie des coordonnées de Cannon.js vers Three.js
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


        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            if (canvasRef.current) {
                canvasRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, backgroundColor: 'black', filter: 'blur(10px)'}} />;
};

export default Three;
