import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Three2Props {
    sphereTexturePath: string;
}

const Three2: React.FC<Three2Props> = ({ sphereTexturePath }) => {
    const sceneRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (sceneRef.current) {
            sceneRef.current.appendChild(renderer.domElement);
        }

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enabled = false;
        controls.enableRotate = false;
        controls.enableZoom = false;
        controls.enablePan = false;

        const loader = new THREE.TextureLoader();
        loader.load('src/assets/funny-background-drawing-backgrounds-cartoon-1-5c9b97d02ea80.png', (texture) => {
            scene.background = texture;
        });

        const sphereTexture = new THREE.TextureLoader().load(sphereTexturePath);
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({ map: sphereTexture });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(2, 0, 1);

        scene.add(sphere);

        const platformTexture = new THREE.TextureLoader().load('lotus-test.jpg');
        const platformGeometry = new THREE.PlaneGeometry(30, 30);
        const platformMaterial = new THREE.MeshBasicMaterial({ map: platformTexture });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.set(0, -1, 9);
        platform.rotation.x = -Math.PI / 2;

        scene.add(platform);

        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);

            sphere.rotation.x += 0.01;
            sphere.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            renderer.dispose();
            if (sceneRef.current) {
                sceneRef.current.removeChild(renderer.domElement);
            }
        };
    }, [sphereTexturePath]);

    return (
        <div
            ref={sceneRef}
            style={{
                position: 'absolute',
                top: -10,
                left: -10,
                width: '110%',
                height: '110%',
                zIndex: -1,
                backgroundColor: 'black',
            }}
        />
    );
};

export default Three2;
