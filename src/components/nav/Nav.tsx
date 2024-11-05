import { Flex, Link } from "@chakra-ui/react";
import Logo from "../logo/Logo";

export default function Nav() {
  return (
    <Flex
      justifyContent="space-between"
      background="#222"
      height="72px"
      paddingLeft="8"
      paddingRight="8"
    >
      <Flex>
        <Logo w="100px" />
      </Flex>

      <Flex gap="8">
        <Link>Events</Link>
        <Link>Artists</Link>
      </Flex>
    </Flex>
  );
}
