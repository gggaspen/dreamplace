import { Flex } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

export default function TopBanner() {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      background="red"
      height="40px"
      overflow={"hidden"}
    >
      <Text whiteSpace={"nowrap"}>
        LOREM IPSUM DOLOR SIT AMET CONSECTETUR ADIPISICING ELIT
      </Text>
    </Flex>
  );
}
