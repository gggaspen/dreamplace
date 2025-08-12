import Image from "next/image";
import Link from "next/link";
import { Text } from "@chakra-ui/react";

export default function WhatsAppBtn({
  text,
  numero_telefono,
  mensaje_default,
}: Readonly<{
  text: string;
  numero_telefono: string;
  mensaje_default: string;
}>) {
  return (
    <Link
      href={`https://wa.me/${numero_telefono}?text=${mensaje_default}`}
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
