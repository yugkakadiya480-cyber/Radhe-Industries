
// Three.js Glass Showcase
// This script creates a realistic 3D animation of three rotating plastic glasses.

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// Configuration
const CONFIG = {
    containerId: 'canvas-container',
    glassCount: 3,
    glassSpacing: 3.5,
    rotationSpeed: 0.005,
    hoverExpansion: 1.1,
    beverages: {
        strawberry: { color: 0xff3366, name: "Strawberry", opacity: 0.9 }, // Vibrant Pinkish Red
        blueberry: { color: 0x4a90e2, name: "Blueberry", opacity: 0.85 }, // Bright Blue
        mango: { color: 0xffa500, name: "Mango", opacity: 0.9 }          // Rich Orange
    }
};

class GlassShowcase {
    constructor() {
        this.container = document.getElementById(CONFIG.containerId);
        if (!this.container) {
            console.error('Canvas container not found');
            return;
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.glasses = [];
        this.textureLoader = new THREE.TextureLoader();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.targetTilt = new THREE.Vector2(0, 0);
        this.currentTilt = new THREE.Vector2(0, 0);
        this.hoveredGlass = null;

        this.init();
        this.animate();

        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onMouseClick.bind(this));
    }

    init() {
        // Scene Setup
        this.scene = new THREE.Scene();

        // Camera Setup
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
        this.camera.position.set(0, 1, 9);
        this.camera.lookAt(0, 0, 0);

        // Renderer Setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        this.setupLights();
        this.createGlasses();

        // Floor (Invisible shadow catcher)
        const geometry = new THREE.PlaneGeometry(20, 20);
        const material = new THREE.ShadowMaterial({ opacity: 0.2 });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -1.5;
        plane.receiveShadow = true;
        this.scene.add(plane);
    }

    setupLights() {
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));

        const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
        dirLight.position.set(5, 10, 7);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        this.scene.add(dirLight);

        const fillLight = new THREE.PointLight(0xffffff, 1.0);
        fillLight.position.set(-5, 0, 5);
        this.scene.add(fillLight);

        const rimLight = new THREE.SpotLight(0xffffff, 2.0);
        rimLight.position.set(0, 5, -5);
        this.scene.add(rimLight);
    }

    createGlasses() {
        const bevKeys = Object.keys(CONFIG.beverages);
        const glassConfig = [
            { x: -CONFIG.glassSpacing, type: bevKeys[0] },
            { x: 0, type: bevKeys[1] },
            { x: CONFIG.glassSpacing, type: bevKeys[2] }
        ];

        const cupGeometry = new THREE.CylinderGeometry(0.8, 0.55, 3, 32, 1, true);
        const lidGeometry = new THREE.SphereGeometry(0.82, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.35);
        const strawGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 16);
        const liquidGeometry = new THREE.CylinderGeometry(0.78, 0.54, 2.8, 32);

        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0,
            roughness: 0.1,
            transmission: 0.95,
            thickness: 0.1,
            transparent: true,
            opacity: 1,
            ior: 1.5,
            side: THREE.DoubleSide
        });

        const lidMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transmission: 0.9,
            thickness: 0.05,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });

        const strawMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transmission: 0.6,
            transparent: true,
            opacity: 0.8
        });

        const logoTexture = this.textureLoader.load('images/company-logo.png');

        glassConfig.forEach((cfg, index) => {
            const group = new THREE.Group();
            group.position.x = cfg.x;
            group.userData = {
                type: cfg.type,
                originalX: cfg.x,
                index: index,
                spinVelocity: 0,
                isSpinning: false
            };

            const rotatorGroup = new THREE.Group();
            rotatorGroup.name = 'rotator';
            group.add(rotatorGroup);

            // 1. Cup Body
            const cup = new THREE.Mesh(cupGeometry, glassMaterial);
            cup.castShadow = true;
            cup.receiveShadow = true;
            rotatorGroup.add(cup);

            // 2. Liquid
            const bev = CONFIG.beverages[cfg.type];
            const liquidMat = new THREE.MeshStandardMaterial({
                color: bev.color,
                transparent: true,
                opacity: bev.opacity,
                roughness: 0.3,
                metalness: 0.1,
                emissive: bev.color,
                emissiveIntensity: 0.2
            });
            const liquid = new THREE.Mesh(liquidGeometry, liquidMat);
            liquid.position.y = -0.1; // Slightly lower than cup rim
            rotatorGroup.add(liquid);

            // 3. Lid
            const lid = new THREE.Mesh(lidGeometry, lidMaterial);
            lid.position.y = 1.5;
            lid.castShadow = true;
            rotatorGroup.add(lid);

            // 4. Straw (Matching tint)
            const strawMat = strawMaterial.clone();
            strawMat.color.set(bev.color);
            strawMat.emissive = new THREE.Color(bev.color);
            strawMat.emissiveIntensity = 0.3;

            const straw = new THREE.Mesh(strawGeometry, strawMat);
            straw.position.set(0.3, 1.8, 0);
            straw.rotation.z = -0.1;
            straw.castShadow = true;
            rotatorGroup.add(straw);

            // 5. Logo Decal
            const logoGeometry = new THREE.CylinderGeometry(0.79, 0.73, 0.7, 32, 1, true, -Math.PI / 5, Math.PI / 2.5);
            const logoMat = new THREE.MeshBasicMaterial({
                map: logoTexture,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            const logo = new THREE.Mesh(logoGeometry, logoMat);
            logo.position.y = 0.2;
            logo.rotation.y = Math.PI;
            group.add(logo);

            this.scene.add(group);
            this.glasses.push(group);
        });
    }

    onMouseMove(event) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Target tilt based on mouse position
        this.targetTilt.x = this.mouse.y * 0.15;
        this.targetTilt.y = this.mouse.x * 0.15;
    }

    onMouseClick(event) {
        if (this.hoveredGlass) {
            this.hoveredGlass.userData.isSpinning = true;
            this.hoveredGlass.userData.spinVelocity = 0.5; // Trigger fast spin
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = Date.now() * 0.001;

        // Update Raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        let currentHover = null;
        if (intersects.length > 0) {
            // Find the top-level group
            let obj = intersects[0].object;
            while (obj.parent && !(obj instanceof THREE.Group && obj.userData.type)) {
                obj = obj.parent;
            }
            if (obj instanceof THREE.Group && obj.userData.type) {
                currentHover = obj;
            }
        }

        this.hoveredGlass = currentHover;

        // Smooth Tilt Lerping
        this.currentTilt.x += (this.targetTilt.x - this.currentTilt.x) * 0.05;
        this.currentTilt.y += (this.targetTilt.y - this.currentTilt.y) * 0.05;

        this.glasses.forEach((glassGroup, index) => {
            const rotator = glassGroup.children.find(child => child.name === 'rotator');

            // 1. Rotation Logic
            let rotationIncrement = CONFIG.rotationSpeed;
            if (glassGroup.userData.isSpinning) {
                rotationIncrement += glassGroup.userData.spinVelocity;
                glassGroup.userData.spinVelocity *= 0.95; // Friction
                if (glassGroup.userData.spinVelocity < 0.001) {
                    glassGroup.userData.isSpinning = false;
                }
            }
            if (rotator) rotator.rotation.y += rotationIncrement;

            // 2. Interactive Tilt
            glassGroup.rotation.x = this.currentTilt.x;
            glassGroup.rotation.z = -this.currentTilt.y;

            // 3. Hover Scaling
            const targetScale = this.hoveredGlass === glassGroup ? 1.1 : 1.0;
            glassGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

            // 4. Bobbing
            glassGroup.position.y = Math.sin(time + index) * 0.1;
        });

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GlassShowcase();
});
