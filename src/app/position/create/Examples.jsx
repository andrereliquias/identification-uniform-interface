import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import NavBar from "../../components/nav/Navbar";

export default function Examples() {
  return (
    <Box minH={"110vh"} minW="100vh">
      <NavBar />

      <Heading
        fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
        textAlign="center"
        paddingTop={"2rem"}
      >
        <Text>Exemplos de envio:</Text>
      </Heading>

      <Flex maxW={"600px"} justify="center" margin={"auto"} mt={"10px"}>
        <Grid
          templateColumns="repeat(3, 1fr)"
          templateRows="repeat(2, 1fr)"
          gap={2}
        >
          <GridItem>
            <Image
              w="150px"
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80"
            />
          </GridItem>

          <GridItem>
            <Image
              w="150px"
              src="https://images.unsplash.com/photo-1605580528632-0718634a48df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
            />
          </GridItem>

          <GridItem>
            <Image
              w="150px"
              src="https://images.unsplash.com/photo-1576558345433-58e777a5e423?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
            />
          </GridItem>

          <GridItem>
            <Image
              w="150px"
              src="https://images.unsplash.com/photo-1605728889623-c5f87966b907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80"
            />
          </GridItem>

          <GridItem>
            <Image
              w="150px"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
            />
          </GridItem>

          <GridItem>
            <Image
              w="150px"
              src="https://images.unsplash.com/photo-1627910016961-ee310ef0b108?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=627&q=80"
            />
          </GridItem>
        </Grid>
      </Flex>
    </Box>
  );
}
