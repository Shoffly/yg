import styles from "/styles/bentoflex.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Bento ({ images }) {
  return (
    <div className={styles.dave}>
      <div className={styles.container}>
        {images.map((image, index) => (
          <Link key={index} href={image.link}>
            
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className={styles.images}
              />
            
          </Link>
        ))}
      </div>
    </div>
  );
}
