import { Box, Container, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NavBar from "../components/nav/Navbar";
import { useUserData } from "../helpers/useUser";
import RegisterCompany from "../company/RegisterCompany";
import { useCookies } from "react-cookie";
import WebcamReader from "../components/webcam-reader/WebcamReader";

export default function Identifier() {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "credentials",
    "userData",
    "company",
  ]);
  const [firstAccess, setFirstAccess] = useState(false);
  const [identificationData, setIdentificationData] = useState({
    quantity: 0,
    positions: [],
    dateTime: null,
  });

  const { data, isLoading, refetch } = useUserData(
    cookies.userData?.id,
    cookies?.token
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    setCookie("company", data.company, {
      path: "/",
    });
    setFirstAccess(data.user.firstAccess);
  }, [data, isLoading, setCookie, setFirstAccess]);

  const formatDate = (dateISO) => {
    const date = new Date(dateISO);

    const dateOption = { day: "2-digit", month: "2-digit", year: "numeric" };
    const hourOption = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    return (
      date.toLocaleDateString("pt-BR", dateOption) +
      " " +
      date.toLocaleTimeString("pt-BR", hourOption)
    );
  };

  return isLoading ? (
    <></>
  ) : firstAccess ? (
    <Box minH={"100vh"} minW="100vh">
      <RegisterCompany
        data={data}
        setFirstAccess={setFirstAccess}
        refetch={refetch}
      />
    </Box>
  ) : (
    <Box minH={"100vh"} minW="100vh">
      <NavBar />

      <Heading
        fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
        textAlign="left"
        ml="40px"
        mt="40px"
      >
        <Text>Câmera principal</Text>
      </Heading>
      <Flex ml="40px" mt="5px">
        <WebcamReader
          setIdentificationData={setIdentificationData}
          positions={data.position}
        />

        <Flex ml="20px" minH={"100vh"} align={"top"} justify={"left"}>
          <Container
            w={"350px"}
            maxH="300px"
            bg={"white"}
            boxShadow={"xl"}
            rounded={"lg"}
            p={6}
            direction={"column"}
          >
            <Heading
              as={"h2"}
              fontSize={{ base: "14px", sm: "20px" }}
              textAlign={"center"}
              mb={5}
            >
              Informações processadas
            </Heading>
            <Stack direction={"column"} spacing={"12px"} fontSize="15px">
              <Flex>
                <Text mt={2} textAlign={"center"} color={"gray.700"}>
                  Pessoas identificadas:
                </Text>
                <Text ml="5px" mt="8px" textAlign={"center"} color={"gray.500"}>
                  {identificationData.quantity}
                </Text>
              </Flex>

              <Flex>
                <Text textAlign={"center"} color={"gray.700"}>
                  Cargos:
                </Text>
                <Box>
                  {identificationData.positions.length === 0
                    ? " -"
                    : identificationData.positions.map((position) => (
                        <Text ml="5px" textAlign={"left"} color={"gray.500"}>
                          {position}
                        </Text>
                      ))}
                </Box>
              </Flex>

              <Flex>
                <Text textAlign={"center"} color={"gray.700"}>
                  Data/hora:
                </Text>
                <Text ml="5px" textAlign={"center"} color={"gray.500"}>
                  {identificationData.dateTime ? formatDate(identificationData.dateTime) : " -"}
                </Text>
              </Flex>
            </Stack>
          </Container>
        </Flex>
      </Flex>
    </Box>
  );
}
