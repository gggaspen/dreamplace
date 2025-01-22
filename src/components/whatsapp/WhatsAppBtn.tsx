import Image from "next/image";
import Link from "next/link";
import { Text } from "@chakra-ui/react";

export default function WhatsAppBtn({ text }: Readonly<{ text: string }>) {
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
      {text ? (
        <Text fontWeight={600}>{text}</Text>
      ) : (
        <Image
          src="/img/icon/whatsapp.png"
          style={{ margin: "20px" }}
          alt="whatsapp"
          width={30}
          height={30}
          priority
        />
      )}
    </Link>
  );
}
