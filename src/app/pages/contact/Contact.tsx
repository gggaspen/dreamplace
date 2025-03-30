import { Box, Text, Flex, Button } from "@chakra-ui/react";
import React from "react";
import "./Contact.css";
import WhatsAppBtn from "../../../components/whatsapp/WhatsAppBtn";

interface IContactData {
  titulo: string;
  texto_boton: string;
  numero_telefono: string;
  mensaje_default: string;
}

export default function Contact({ config }: { config: IContactData }) {
  const { titulo, texto_boton, numero_telefono, mensaje_default } = config;

  return (
    <>
      <Box 
      h={"auto"}
      bg={"#000"} py={"2em"} px={{ base: "2em", md: "14em" }}>
        <Text
          fontSize={{ base: "1.5em", md: "3em" }}
          fontWeight={600}
          // py={".5em"}
          mb={".5em"}
          color={"#eee"}
          textAlign={"center"}
        >
          {titulo}
        </Text>
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          gap={"2em"}
          h={"50%"}
          pb={"1.5em"}
        >
          {/* <Text
            fontWeight={"bold"}
            fontSize={{ base: "1em", md: "2em" }}
            flex={1}
            color={"#eee"}
          >
            Send us a WhatsApp
          </Text> */}
          {/* <Flex
            display={{ base: "none", lg: "flex" }}
            alignItems={"flex-end"}
            flex={2}
          >
            <Text color={"#eee"}>{description}</Text>
          </Flex> */}
          <Button
            bgColor={"yellow"}
            borderRadius={"0px"}
            p={"1em"}
            color={"#eee"}
            className="btn-buy"
            // w={"60px"}
            // h={"60px"}
          >
            {/* <Arrow direction={"top-right"} color={"#eee"}></Arrow> */}
            <WhatsAppBtn
              text={texto_boton}
              numero_telefono={numero_telefono}
              mensaje_default={mensaje_default}
            />
          </Button>
        </Flex>
        {/* <Text
          color={"#eee"}
          mb={"3em"}
          mt={"1em"}
          display={{ base: "flex", lg: "none" }}
          fontSize={{ base: ".5em", md: "1em" }}
        >
          {description}
        </Text> */}
        <Box bgColor={"#eee"} h={"1px"} />
      </Box>
    </>
  );
}
