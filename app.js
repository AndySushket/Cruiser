/**
 * Created by Ellyson on 10/1/2017.
 */
class Water {

	constructor() {
		this.scene= new THREE.Scene();
		this.scene.fog = new THREE.Fog("#366491", 500, 8850);
		this.renderer = new THREE.WebGLRenderer();
		this.light=new THREE.AmbientLight(0xffffff);
		this.raycaster = new THREE.Raycaster();

		this.initScene();
		console.log(this)

	}
	onMouseMove( event ) {

		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		this.raycaster.setFromCamera( this.mouse, this.camera );


		let intersects = this.raycaster.intersectObjects( this.scene.children,true );
		for ( var i = 0; i < intersects.length; i++ ) {
			if(intersects[i].object.name === "default" ){
				let sound = new Audio();
				sound.src = "ship horn - sound effect.mp3";
				sound.play();
			}
		}

}
	initScene(){

		this.renderer.setSize(window.innerWidth,window.innerHeight);
		document.getElementById("webgl-container").appendChild(this.renderer.domElement);

		this.camera = new THREE.PerspectiveCamera(35,window.innerWidth/window.innerHeight,1,100000);

		this.camera.position.z=150;
		this.camera.position.y=150;
		this.scene.add(this.camera);

		this.texture = new THREE.TextureLoader().load("water4.jpg");
		this.texture.wrapS = THREE.RepeatWrapping;
		this.texture.wrapT =THREE.RepeatWrapping;
		this.texture.repeat.set( 20, 20 );

		this.plane = new THREE.Mesh(
			new THREE.PlaneGeometry(10000,10000,500,500),
			new THREE.MeshPhongMaterial({
				// emissive: 0x00000,
				color:0x2F5984,
				// specular:0xC1F4FF,
				// wireframe:true,
				shininess:5,
				map:this.texture,
				side:THREE.DoubleSide
			})
		);
		this.box = new THREE.Mesh(new THREE.BoxGeometry(20,20,20),new THREE.MeshNormalMaterial());

		this.light = new THREE.DirectionalLight(new THREE.Color("#0xffffff"));
		this.light.position.set(0,50,0);
		this.scene.add(this.light);
		this.scene.add(this.box);

		this.scene.add(this.plane);
		this.plane.rotation.x =90* (	-Math.PI/180);

		this.controls = new THREE.OrbitControls( this.camera );
		this.camera.position.set( 0, 220, 800 );
		this.controls.update();

		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setBaseUrl( "Cruisership" );
		mtlLoader.setPath( "Cruisership" );
		mtlLoader.load( '/Cruiser.mtl', ( materials ) => {

			materials.preload();

			var loaderOBJ = new THREE.OBJLoader();
			loaderOBJ.setMaterials( materials );
			// loaderOBJ.setName( "Cruiser" );

			loaderOBJ.load( 'Cruisership/Cruiser.obj', ( event )=> {

				this.scene.add(event);
				event.name = "Cruiser";
				this.cruiser = event;
				this.cruiser.position.y = -30;;
				// this.camera.lookAt(this.cruiser);
			});

		});
		let skyboxmaterials = [ new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("skybox/lagoon_ft.png"),side:THREE.DoubleSide}),
			new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("skybox/lagoon_bk.png"),side:THREE.DoubleSide}),
			new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("skybox/lagoon_up.png"),side:THREE.DoubleSide}),
			new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("skybox/lagoon_dn.png"),side:THREE.DoubleSide}),
			new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("skybox/lagoon_rt.png"),side:THREE.DoubleSide}),
			new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("skybox/lagoon_lf.png"),side:THREE.DoubleSide}),
		];
		let skybox = new THREE.Mesh(new THREE.CubeGeometry(10000,10000,10000),new THREE.MeshFaceMaterial(skyboxmaterials));
		this.scene.add(skybox);

		this.animate();

		window.addEventListener( 'mouseup', this.onMouseMove.bind(this), false );
	}


	alterGeometry(){
		for(let i=0;i<=this.plane.geometry.vertices.length -1; i++){
			let random =Math.random()*Math.PI*2;
			this.plane.geometry.vertices[i].z = Math.sin(Math.PI+random);
		}
		this.plane.geometry.verticesNeedUpdate = true;
		this.plane.material.needsUpdate = true;
	}
	animate(){
		let random =  Math.floor((Math.random()*10)+1);
		if(random>9)this.alterGeometry();
		if(this.plane){
			this.plane.material.map.offset.x+=0.001;
			this.plane.material.map.offset.y+=0.001;
		}
		this.renderer.render(this.scene,this.camera);
		requestAnimationFrame(this.animate.bind(this));

	}
}
let lava = new Water();