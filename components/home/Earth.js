import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

import styles from '../../styles/earth.module.css'

function Box(props) {
  const mesh = useRef()
  const [active, setActive] = useState(false)

  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load('../../img/earth.jpg')

  window.addEventListener('resize', () => {})

  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={[2.5, 2.5, 2.5]}
      onClick={(e) => setActive(!active)}>
      <sphereGeometry args={[1, 100, 100]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

export default function Earth() {
  return (
    <Canvas
      className={styles.wrap}
      camera={{}}
    >
      <ambientLight intensity={0.5} color={0x000000} />
      <spotLight position={[10, 1, 1]} angle={0.15} penumbra={0.5} />
      <pointLight position={[0, 1.5, 2]} />
      <Box position={[0, 0, 0]} />
    </Canvas>
  )
}
