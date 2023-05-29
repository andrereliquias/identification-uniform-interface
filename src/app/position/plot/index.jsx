import { Box, Flex, Heading, Image, Text, useToast } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { apiConnection } from "../../services/apiConnection";
import { useCookies } from "react-cookie";
import NavBar from "../../components/nav/Navbar";
import { apiIdentificationConnection } from "../../services/apiIdentificationConnection";

export default function PlotGraph() {
  const positionId = new URLSearchParams(window.location.search).get("id");
  const imageRef = useRef(null);

  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "credentials",
    "userData",
    "company",
  ]);

  const toast = useToast();

  useEffect(() => {
    async function getGraph() {
      try {
        const { data } = await apiConnection.get(
          `/identifications?pIdentificationId=${positionId}`,
          {
            headers: {
              Authorization: cookies.token,
            },
          }
        );

        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        const responseGraph = await apiIdentificationConnection.post(
          "/plot",
          formData
        );

        const base64Image = `data:image/jpeg;base64,${responseGraph.data.plot_url}`;

        imageRef.current.src = base64Image;
      } catch (error) {
        console.error("erro ao capturar grafico", error);

        toast({
          title: "Erro ao gerar relatório.",
          description: "Tente novamente mais tarde.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }

    if (!!positionId) {
      getGraph();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionId]);

  return (
    <Box minH={"100vh"} minW="100vh">
      <NavBar />

      <Heading
        fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
        textAlign="center"
        paddingTop={"2rem"}
      >
        <Text>Gráfico de identificação</Text>
      </Heading>

      <Flex
        flexDir={"column"}
        alignItems={"center"}
        w="100%"
        h="100%"
        marginTop={"30px"}
      >
        <Box w="490px" h="367.65px">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
            w="490px"
            h="367.65px"
            ref={imageRef}
            alt="Gráfico processado"
          />
        </Box>
      </Flex>
    </Box>
  );
}
