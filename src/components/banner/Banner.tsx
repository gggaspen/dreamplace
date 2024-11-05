import { Text, Box, Flex, Button } from "@chakra-ui/react";

export default function Banner() {
  return (
    <Flex
      alignItems="flex-end"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#270027",
        // backgroundImage:
        //   "url(https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3h6eWo5Z3VtZHl0OWxseWkxaTl3NjB3emt6MmoxYXg2b3d2aDJ1OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/88Fu8MtnSXI6j3ywN8/giphy.gif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: "scaleX(-1)",
        zIndex: 0,
      }}
    >
      <Flex
        flexDirection="column"
        justifyContent="flex-end"
        gap="2"
        h="100vh"
        zIndex={1}
        paddingBottom={"10%"}
        paddingLeft={"10%"}
        paddingRight={{ base: "10%", lg: "40%" }}
      >
        <Box>
          <Text fontSize={{ base: "2em", lg: "3em" }}>
            LOREM IPSUM dolor sit amet consectetur
          </Text>
        </Box>
        <Box>
          <Text fontSize={"1em"}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit
            amet consectetur adipisicing elit.
          </Text>
        </Box>
        <Box>
          <Button
            w={"100%"}
            backgroundColor={"#eee"}
            color={"#111"}
            fontWeight={"600"}
            border={"none"}
            cursor={"pointer"}
            padding={"10px 20px"}
            transition={"background-color 0.2s ease-out, color 0.2s ease-out"}
            _hover={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "#eee",
              boxShadow: "inset 0 0 0px 1px #eee",
            }}
          >
            LOREM IPSUM NOW
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
}
