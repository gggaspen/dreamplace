import { Text, Link, Box } from "@chakra-ui/react";

export default function ButtonPrimary({
  children,
  text,
  download,
}: Readonly<{
  children: React.ReactNode;
  text?: string;
  download?: boolean;
}>) {
  const url =
    // "https://www.passline.com/eventos/sab-3011-agustin-pietrocola-ailen-dc-naza-rv-facukid-ariel-stamile-meline-323995/lean-gorosito";
    "https://www.todopass.com.ar/inicio/355-fiesta-de-noel-xv.html";

  return (
    <Link
      href={download ? "./pdf/Presskit 2024 - Agustin Pietrocola.pdf" : url}
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
      <Box display={{ sm: "none", base: "none", md: "block" }}>
        <Text>{children}</Text>
      </Box>
      <Box>
        <Text fontSize={{ sm: "1em", base: "1em", md: "1em" }}>
          {text ? text : "CONSEGUÍ AHORA TUS TICKETS"}
        </Text>
      </Box>
      <Box opacity={0} display={{ sm: "none", base: "none", md: "block" }}>
        <Text>{children}</Text>
      </Box>
    </Link>
  );
}
