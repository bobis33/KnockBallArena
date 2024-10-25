import React, { useEffect, useRef, useState, useContext } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { supabase } from '../../supabaseClient';

let nbBalls = 30;
let ballsize = 1;
let prevY = 0;
let currentHighScore2 = 0;
let score2 = 0;

interface Three4Props {
    userId: string;
    score: number; 
    handleBackToHome: () => void;
}

export default function Three4({ userId, shpereTexturePath, handleBackToHome }: Three4Props & { shpereTexturePath: string }) {

    const canvasRef = useRef<HTMLDivElement>(null);
    const sphereBodiesRef = useRef<CANNON.Body[]>([]);
    const spheresRef = useRef<THREE.Mesh[]>([]);
    const controllableSphereRef = useRef<THREE.Mesh | null>(null);
    const controllableBodyRef = useRef<CANNON.Body | null>(null);
    const pressedKeys = useRef<Set<string>>(new Set());
    const speedLimit = 4;
    const acceleration = 1 * (ballsize * 2);
    const deceleration = 1;

    const [score, setScore] = useState(0);
    const [currentHighScore, setCurrentHighScore] = useState(0);


    useEffect(() => {
        const fetchHighScore = async () => {
          if (!userId) return;
    
          try {
            const { data, error } = await supabase
                .from('profile')
                .select('high_score')
                .eq('id', userId)
                .single();
    
            if (error) {
              throw error;
            }
            if (data) {
                currentHighScore2 = data.high_score;
            }
          } catch (error) {
            console.error('Error fetching High Score:', error);
          }
        };
    
        fetchHighScore();
      }, [userId]);

    const SetHighScore = async () => {
      if (!userId) return;
      try {
        const { data, error } = await supabase
            .from('profile')
            .update({ high_score: score2 })
            .eq('id', userId)    
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Error setting High Score:', error);
      }
    };




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

        const resetvalues = () => {
            nbBalls = 30;
            ballsize = 1;
            prevY = 0;
            sphereBodiesRef.current = [];
            spheresRef.current = [];
            controllableSphereRef.current = null;
            controllableBodyRef.current = null;
            pressedKeys.current.clear();
            setScore(0);
        }
    
        //background
    
        // Charger la texture de ciel
        const loader = new THREE.TextureLoader();
        const skyTexture = loader.load('space.png');
    
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
    
        for (let i = 0; i < nbBalls; i++) {
            const texture = textures[Math.floor(Math.random() * textures.length)];
            const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(Math.random() * 10 - 5, 2, Math.random() * 10 - 5);
            scene.add(sphere);
            spheresRef.current.push(sphere);
        }
    
        // boule controlable
        const controllableTexture = new THREE.TextureLoader().load(shpereTexturePath);
        const controllableMaterial = new THREE.MeshBasicMaterial({ map: controllableTexture });
        let controllableSphere = new THREE.Mesh(sphereGeometry, controllableMaterial);
        controllableSphere.position.set(0, 2, 0);
        controllableSphere.scale.set(ballsize, ballsize, ballsize);
        scene.add(controllableSphere);
        controllableSphereRef.current = controllableSphere;
    
        ballsize = 1;
    
        //MAP
        const platformTexture = new THREE.TextureLoader().load('floor.jpg');
        const platformGeometry = new THREE.PlaneGeometry(15, 15);
        const platformMaterial = new THREE.MeshBasicMaterial({ map: platformTexture });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.set(0, -0.5, 0);
        platform.rotation.x = -Math.PI / 2;
        scene.add(platform);
    
        const Shape1Texture = new THREE.TextureLoader().load('floor.jpg', (texture) => {
            // Crée le matériau avec une correction pour le rendu double face
            const Shape1Material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });
            const Shape1Geometry = new THREE.BoxGeometry(15, 1, 15);
            const Shape1 = new THREE.Mesh(Shape1Geometry, Shape1Material);
            Shape1.position.set(0, -1, 0);
            scene.add(Shape1);
        });
    
        //
    
        camera.position.set(0, 8, 10);
        camera.lookAt(0, 0, 0);
    
        const world = new CANNON.World();
        world.gravity.set(0, -100, 0);
    
        const sphereShape = new CANNON.Sphere(1);
        let spherePlayerShape = new CANNON.Sphere(ballsize);
        const friction = 0.3;
    
        for (let i = 0; i < nbBalls; i++) {
            const sphereBody = new CANNON.Body({ mass: 10, position: new CANNON.Vec3(Math.random() * 10 - 5, 2, Math.random() * 10 - 5), material: new CANNON.Material({ friction }) });
            sphereBody.addShape(sphereShape);
            world.addBody(sphereBody);
            sphereBodiesRef.current.push(sphereBody);
        }
    
        // boule controlable
        let controllableBody = new CANNON.Body({ mass: 10 * ballsize, position: new CANNON.Vec3(0, 2, 0), material: new CANNON.Material({ friction }) });
        controllableBody.addShape(spherePlayerShape);
        world.addBody(controllableBody);
        controllableBodyRef.current = controllableBody;
    
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
    
        // Augmenter le score
        const scoreInterval = setInterval(() => {
            setScore(prevScore => {
    
                // Vérifiez si le score est divisible par 3 pour augmenter la taille
                if ((prevScore + 1) % 1 === 0 && controllableBody.position.y > 0) {
                    ballsize += 0.001; // Augmenter la taille de la boule
                    if (controllableSphereRef.current) {
                        controllableSphereRef.current.scale.set(ballsize, ballsize, ballsize); // Mettre à jour l'échelle du mesh
                    }
    
                    // Mettre à jour la forme de collision
                    if (controllableBodyRef.current) {
                        const controllableBody = controllableBodyRef.current;
    
                        // Supprimer l'ancienne forme et ajouter la nouvelle forme avec le nouveau rayon
                        controllableBody.removeShape(controllableBody.shapes[0]); // Supprimer l'ancienne forme
                        const newSphereShape = new CANNON.Sphere(ballsize); // Créer une nouvelle forme avec le nouveau rayon
                        controllableBody.addShape(newSphereShape); // Ajouter la nouvelle forme
                    }
                }
                setScore(prevScore + 1);
                score2 = prevScore + 1;
                return prevScore + 1; // Retourner le nouveau score
            });
        }, 50);
    
        // Appliquer des impulsions aléatoires aux sphères
        const applyRandomImpulse = (body: CANNON.Body) => {
            const impulse = new CANNON.Vec3(
                (Math.random() - 0.5) * 100,
                0,
                (Math.random() - 0.5) * 100
            );
            body.applyImpulse(impulse, body.position);
        };
    
        // Appliquer des impulsions
        const intervalId = setInterval(() => {
            sphereBodiesRef.current.forEach(applyRandomImpulse);
        }, 500);
    
        const updatePhysics = () => {
            world.step(1 / 60);
    
            const resetHeight = -20;
            sphereBodiesRef.current.forEach((sphereBody, index) => {
                if (sphereBody.position.y < resetHeight && spheresRef.current[index]) {
                    sphereBody.position.set(Math.random() * 10 - 5, 8, Math.random() * 10 - 5);
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
                    controllableBody.velocity.x += direction.x * acceleration * 10;
                    controllableBody.velocity.z += direction.z * acceleration * 10;
                } else {
                    const decelerationFactor = Math.min(deceleration * 0.01, 1);
                    controllableBody.velocity.x -= controllableBody.velocity.x * decelerationFactor;
                    controllableBody.velocity.z -= controllableBody.velocity.z * decelerationFactor;
                }
    
                controllableBody.velocity.x = Math.max(-speedLimit, Math.min(speedLimit, controllableBody.velocity.x));
                controllableBody.velocity.z = Math.max(-speedLimit, Math.min(speedLimit, controllableBody.velocity.z));
    
                // Vérifiez la position de la sphère contrôlable
                //check si l'un est positif et l'autre négatif
                if (controllableBody.position.y < 0 && prevY < 0) {
                    if (controllableBody.position.y < resetHeight - 5) {
                        if (prevY > resetHeight - 5) {
                            if (score2 > currentHighScore2) {
                                SetHighScore();
                            }
                            resetvalues();
                            controllableBody.position.set(0, 5, 0);
                            controllableBody.velocity.set(0, 0, 0);
                            prevY = 5;
                            setScore(0);
                            ballsize = 1;
                            handleBackToHome();
                        }
                    }
                }
                prevY = controllableBody.position.y;
                
    
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
            clearInterval(scoreInterval);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            renderer.dispose();
            if (canvasRef.current) {
                canvasRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);
    

    return (
        <div ref={canvasRef}>
            {/* Afficher le score */}
            <div style={{ position: 'absolute', top: 20, left: 20, color: 'black', fontSize: '20px' }}>
                Score: {score}
            </div>
        </div>
    );
};


