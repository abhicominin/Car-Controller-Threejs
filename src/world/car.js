
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export default class Car {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;

        this.car = {};
        this.chassis = {};
        this.wheels = [];
        this.chassisDimension = {
	x: 1.96,
	y: 1,
	z: 4.3
};
        this.chassisModelPos = {
	x: 0,
	y: -0.629999999999999,
	z: 0
};
        this.wheelScale = {
	frontWheel: 1.1,
	hindWheel: 1.1
};
        this.mass = 250;
    }

    init() {
        this.loadModels();
        this.setChassis();
        this.setWheels();
        this.controls();
        this.update()
    }

    loadModels() {
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();

        dracoLoader.setDecoderConfig({ type: 'js' })
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

        gltfLoader.setDRACOLoader(dracoLoader);

        gltfLoader.load("./car/chassis.gltf", gltf => {
            this.chassis = gltf.scene;
            this.chassis.traverse( function(object){
                if(object.isMesh)
                {
                    object.castShadow = true
                    object.material = new THREE.MeshToonMaterial({color: 0xFF55BB})
                }
            })
        
            this.scene.add(this.chassis);
        })

        this.wheels = [];
        for(let i = 0 ; i < 4 ; i++) {
            gltfLoader.load("./car/wheel.gltf", gltf => {
                const model = gltf.scene;
                this.wheels[i] = model;
                if(i === 1 || i === 3)
                    this.wheels[i].scale.set(-1 * this.wheelScale.frontWheel, 1 * this.wheelScale.frontWheel, -1 * this.wheelScale.frontWheel);
                else
                    this.wheels[i].scale.set(1 * this.wheelScale.frontWheel, 1 * this.wheelScale.frontWheel, 1 * this.wheelScale.frontWheel);
                this.scene.add(this.wheels[i]);
            })
        }
    }

    setChassis() {
        const chassisShape = new CANNON.Box(new CANNON.Vec3(this.chassisDimension.x * 0.5, this.chassisDimension.y * 0.5, this.chassisDimension.z * 0.5));
        const chassisBody = new CANNON.Body({mass: this.mass, material: new CANNON.Material({friction: 0})});
        chassisBody.addShape(chassisShape);

        this.car = new CANNON.RaycastVehicle({
            chassisBody,
            indexRightAxis: 0,
            indexUpAxis: 1,
            indexForwardAxis: 2
        });
        this.car.addToWorld(this.world);
    }

    setWheels() {
        this.car.wheelInfos = [];
        this.car.addWheel({
                radius: 0.35,
                directionLocal: new CANNON.Vec3(0, -1, 0),
                suspensionStiffness: 55,
                suspensionRestLength: 0.5,
                frictionSlip: 30,
                dampingRelaxation: 2.3,
                dampingCompression: 4.3,
                maxSuspensionForce: 10000,
                rollInfluence:  0.01,
                axleLocal: new CANNON.Vec3(-1, 0, 0),
                chassisConnectionPointLocal: new CANNON.Vec3(0.75, 0.1, -1.32),
                maxSuspensionTravel: 1,
                customSlidingRotationalSpeed: 30,
            });
        this.car.addWheel({
                radius: 0.35,
                directionLocal: new CANNON.Vec3(0, -1, 0),
                suspensionStiffness: 55,
                suspensionRestLength: 0.5,
                frictionSlip: 30,
                dampingRelaxation: 2.3,
                dampingCompression: 4.3,
                maxSuspensionForce: 10000,
                rollInfluence:  0.01,
                axleLocal: new CANNON.Vec3(-1, 0, 0),
                chassisConnectionPointLocal: new CANNON.Vec3(-0.78, 0.1, -1.32),
                maxSuspensionTravel: 1,
                customSlidingRotationalSpeed: 30,
            });
        this.car.addWheel({
                radius: 0.35,
                directionLocal: new CANNON.Vec3(0, -1, 0),
                suspensionStiffness: 55,
                suspensionRestLength: 0.5,
                frictionSlip: 30,
                dampingRelaxation: 2.3,
                dampingCompression: 4.3,
                maxSuspensionForce: 10000,
                rollInfluence:  0.01,
                axleLocal: new CANNON.Vec3(-1, 0, 0),
                chassisConnectionPointLocal: new CANNON.Vec3(0.75, 0.1, 1.25),
                maxSuspensionTravel: 1,
                customSlidingRotationalSpeed: 30,
            });
        this.car.addWheel({
                radius: 0.35,
                directionLocal: new CANNON.Vec3(0, -1, 0),
                suspensionStiffness: 55,
                suspensionRestLength: 0.5,
                frictionSlip: 30,
                dampingRelaxation: 2.3,
                dampingCompression: 4.3,
                maxSuspensionForce: 10000,
                rollInfluence:  0.01,
                axleLocal: new CANNON.Vec3(-1, 0, 0),
                chassisConnectionPointLocal: new CANNON.Vec3(-0.78, 0.1, 1.25),
                maxSuspensionTravel: 1,
                customSlidingRotationalSpeed: 30,
            });

        this.car.wheelInfos.forEach( function(wheel, index) {
            const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20)
            const wheelBody = new CANNON.Body({
                mass: 1,
                material: new CANNON.Material({friction: 0}),
            })
            const quaternion = new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0)
            wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion)
            // this.wheels[index].wheelBody = wheelBody;
        }.bind(this));
    }

    controls() {
        const maxSteerVal = 0.5;
        const maxForce = 750;
        const brakeForce = 36;
        const slowDownCar = 19.6;
        const keysPressed = [];

        window.addEventListener('keydown', (e) => {
            // e.preventDefault();
            if(!keysPressed.includes(e.key.toLowerCase())) keysPressed.push(e.key.toLowerCase());
            hindMovement();
        });
        window.addEventListener('keyup', (e) => {
            // e.preventDefault();
            keysPressed.splice(keysPressed.indexOf(e.key.toLowerCase()), 1);
            hindMovement();
        });

        const hindMovement = () => {
            if(keysPressed.includes("r") || keysPressed.includes("r")) resetCar();

            if(!keysPressed.includes(" ") && !keysPressed.includes(" ")){
                this.car.setBrake(0, 0);
                this.car.setBrake(0, 1);
                this.car.setBrake(0, 2);
                this.car.setBrake(0, 3);

                if(keysPressed.includes("a") || keysPressed.includes("arrowleft")) {
                    this.car.setSteeringValue(maxSteerVal * 1, 2);
                    this.car.setSteeringValue(maxSteerVal * 1, 3);
                }
                else if(keysPressed.includes("d") || keysPressed.includes("arrowright")) {
                    this.car.setSteeringValue(maxSteerVal * -1, 2);
                    this.car.setSteeringValue(maxSteerVal * -1, 3);
                }
                else stopSteer();

                if(keysPressed.includes("w") || keysPressed.includes("arrowup")) {
                    this.car.applyEngineForce(maxForce * -1, 0);
                    this.car.applyEngineForce(maxForce * -1, 1);
                    this.car.applyEngineForce(maxForce * -1, 2);
                    this.car.applyEngineForce(maxForce * -1, 3);
                }
                else if(keysPressed.includes("s") || keysPressed.includes("arrowdown")) {
                    this.car.applyEngineForce(maxForce * 1, 0);
                    this.car.applyEngineForce(maxForce * 1, 1);
                    this.car.applyEngineForce(maxForce * 1, 2);
                    this.car.applyEngineForce(maxForce * 1, 3);
                }
                else stopCar();
            }
            else
                brake();
        }

        const resetCar = () => {
            this.car.chassisBody.position.set(0, 4, 0);
            this.car.chassisBody.quaternion.set(0, 0, 0, 1);
            this.car.chassisBody.angularVelocity.set(0, 0, 0);
            this.car.chassisBody.velocity.set(0, 0, 0);
        }

        const brake = () => {
            this.car.setBrake(brakeForce, 0);
            this.car.setBrake(brakeForce, 1);
            this.car.setBrake(brakeForce, 2);
            this.car.setBrake(brakeForce, 3);
        }

        const stopCar = () => {
            this.car.setBrake(slowDownCar, 0);
            this.car.setBrake(slowDownCar, 1);
            this.car.setBrake(slowDownCar, 2);
            this.car.setBrake(slowDownCar, 3);
        }

        const stopSteer = () => {
            this.car.setSteeringValue(0, 2);
            this.car.setSteeringValue(0, 3);
        }
    }

    update() {
        const updateWorld = () => {
            if(this.car.wheelInfos && this.chassis.position && this.wheels[0].position){
                this.chassis.position.set(
                    this.car.chassisBody.position.x + this.chassisModelPos.x,
                    this.car.chassisBody.position.y + this.chassisModelPos.y,
                    this.car.chassisBody.position.z + this.chassisModelPos.z
                );
                this.chassis.quaternion.copy(this.car.chassisBody.quaternion);
                for(let i = 0 ; i < 4 ; i++) {
                    if(this.car.wheelInfos[i]) {
                        this.car.updateWheelTransform(i);
                        this.wheels[i].position.copy(this.car.wheelInfos[i].worldTransform.position);
                        this.wheels[i].quaternion.copy(this.car.wheelInfos[i].worldTransform.quaternion);
                    }
                }
            }
        }
        this.world.addEventListener('postStep', updateWorld);
    }
}
    