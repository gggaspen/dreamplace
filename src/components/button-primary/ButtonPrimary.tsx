import { Text, Link, Box } from "@chakra-ui/react";

export default function ButtonPrimary({
  children,
  text,
  download,
  mode,
}: Readonly<{
  children: React.ReactNode;
  text?: string;
  download?: boolean;
  mode?: "light" | "dark";
}>) {
  const url =
    // "https://www.passline.com/eventos/sab-3011-agustin-pietrocola-ailen-dc-naza-rv-facukid-ariel-stamile-meline-323995/lean-gorosito";
    "https://www.todopass.com.ar/inicio/355-fiesta-de-noel-xv.html";

  // Colores condicionales según el modo
  const backgroundColor = mode === "light" ? "#000" : "#eee";
  const color = mode === "light" ? "#fff" : "#111";
  const hoverBackgroundColor = mode === "light" ? "#333" : "rgba(0, 0, 0, 0.6)";
  const hoverColor = mode === "light" ? "#eee" : "#eee";
  return (
    <Link
      href={download ? "./pdf/Presskit 2024 - Agustin Pietrocola.pdf" : url}
      target="_blank"
      w={"100%"}
      textAlign={"center"}
      backgroundColor={backgroundColor}
      color={color}
      fontWeight={"600"}
      border={"none"}
      cursor={"pointer"}
      padding={"10px 20px"}
      marginTop={"1em"}
      borderRadius={"none"}
      transition={"background-color 0.2s ease-out, color 0.2s ease-out"}
      _hover={{
        backgroundColor: hoverBackgroundColor,
        color: hoverColor,
        boxShadow: "inset 0 0 0px 1px #eee",
      }}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      outline={"none"}
    >
      <Box display={{ sm: "none", base: "none", md: "block" }}>
        <Text>{children}</Text>
      </Box>
      <Box>
        <Text fontSize={{ sm: "1em", base: "1em", md: "1em" }}>
          {text ? text : "COMPRAR TICKETS AHORA"}
        </Text>
      </Box>
      <Box opacity={0} display={{ sm: "none", base: "none", md: "block" }}>
        <Text>{children}</Text>
      </Box>
    </Link>
  );
}
