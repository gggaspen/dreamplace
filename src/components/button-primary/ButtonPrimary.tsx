import { Text, Link, Box } from "@chakra-ui/react";

export default function ButtonPrimary({
  children,
  text,
  download,
  mode,
  disabled = false,
  linkUrl,
}: Readonly<{
  children: React.ReactNode;
  text?: string;
  download?: boolean;
  mode?: "light" | "dark";
  disabled?: boolean;
  linkUrl?: string;
}>) {
  const backgroundColor = mode === "light" ? "#000" : "#eee";
  const color = mode === "light" ? "#fff" : "#111";
  const hoverBackgroundColor = mode === "light" ? "#333" : "rgba(0, 0, 0, 0.6)";
  const hoverColor = mode === "light" ? "#eee" : "#eee";

  return (
    <>
      {disabled ? (
        <Box
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
            <Text
              whiteSpace={"nowrap"}
              fontSize={{ sm: ".7em", base: ".7em", md: "1em" }}
            >
              {text ? text : "COMPRAR TICKETS AHORA"}
            </Text>
          </Box>
          <Box opacity={0} display={{ sm: "none", base: "none", md: "block" }}>
            <Text>{children}</Text>
          </Box>
        </Box>
      ) : (
        <Link
          href={
            download ? "./pdf/Presskit 2024 - Agustin Pietrocola.pdf" : linkUrl
          }
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
      )}
    </>
  );
}
