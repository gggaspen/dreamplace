import { Text, Link } from "@chakra-ui/react";

export default function ButtonPrimary({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const url =
    "https://www.passline.com/eventos/sab-3011-agustin-pietrocola-ailen-dc-naza-rv-facukid-ariel-stamile-meline-323995/lean-gorosito";

  return (
    <Link
      href={url}
      target="_blank"
      w={"100%"}
      textAlign={"center"}
      backgroundColor={"#eee"}
      color={"#111"}
      fontWeight={"600"}
      border={"none"}
      cursor={"pointer"}
      padding={"10px 20px"}
      marginTop={"1em"}
      borderRadius={"none"}
      transition={"background-color 0.2s ease-out, color 0.2s ease-out"}
      _hover={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "#eee",
        boxShadow: "inset 0 0 0px 1px #eee",
      }}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      outline={"none"}
    >
      <Text display={{ base: "none", md: "block" }}>{children}</Text>
      <Text fontSize={{ base: ".6em", md: "1em" }}>
        CONSEGUÍ AHORA TUS ENTRADAS
      </Text>
      <Text display={{ base: "none", md: "block" }}>{children}</Text>
    </Link>
  );
}
