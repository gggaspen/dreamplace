import Image from "next/image";
import Link from "next/link";

export default function WhatsAppBtn() {
  const encodedMessage = "Hola! Estoy en la página web.\n";
  const phoneNumber = "+5492494332023";
  return (
    <Link
      href={`https://wa.me/${phoneNumber}?text=${encodedMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        src="/img/icon/whatsapp.png"
        style={{ margin: "20px" }}
        alt="whatsapp"
        width={30}
        height={30}
        priority
      />
    </Link>
  );
}
