import React, { useRef, useEffect, useState } from "react";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { apiConnection } from "../../services/apiConnection";
import { useCookies } from "react-cookie";
import { apiIdentificationConnection } from "../../services/apiIdentificationConnection";

const WebcamReader = ({ setIdentificationData, positions }) => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "credentials",
    "userData",
    "company",
  ]);

  const webcamRef = useRef(null);
  const webcamRefAux = useRef(null);
  const processedRef = useRef(null);
  const [intervalId, setIntervalId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        webcamRef.current.srcObject = stream;
        webcamRefAux.current.srcObject = stream;
      } catch (error) {
        console.error("Erro ao acessar a webcam:", error);
      }
    };

    startVideo();

    return () => {
      if (webcamRef.current && webcamRef.current.srcObject) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        webcamRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [isProcessing]);

  const processFrame = async () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = webcamRef.current.videoWidth;
    canvas.height = webcamRef.current.videoHeight;

    context.drawImage(webcamRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob);

      try {
        const { data } = await apiIdentificationConnection.post(
          "/process",
          formData
        );

        const filteredDetections = positions.filter((obj2) =>
          data.detections.some((obj1) => obj1.color === obj2.color)
        );

        const positionsNames = filteredDetections.map((item) => item.name);
        const dateTimeIdentification = new Date().toISOString();
        setIdentificationData({
          quantity: filteredDetections.length,
          positions: positionsNames,
          dateTime: dateTimeIdentification,
        });
        const base64Image = `data:image/jpeg;base64,${data.image}`;

        processedRef.current.src = base64Image;

        if (filteredDetections.length !== 0) {
          filteredDetections.forEach((position) => {
            const identifications = {
              pIdentificationId: position.id,
              dateTime: dateTimeIdentification,
            };

            try {
              apiConnection.post("/identifications", identifications, {
                headers: {
                  Authorization: cookies.token,
                },
              });
            } catch (error) {
              console.error(
                "Erro ao enviar dado de captura de identificação",
                error
              );
            }
          });
        }
      } catch (error) {
        console.error("Erro ao processar a imagem:", error);
      } finally {
        setIsLoading(false);
      }
    }, "image/jpeg");
  };

  const startProcessing = () => {
    setIsLoading(true);
    const id = setInterval(processFrame, 2000);
    setIntervalId(id);
    setIsProcessing(true);
  };

  const stopProcessing = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    setIsProcessing(false);
    setIsLoading(false);
  };

  return (
    <Box>
      <Flex gap="3">
        <Button onClick={startProcessing}>Iniciar</Button>
        <Button onClick={stopProcessing}>Parar</Button>
        {positions && positions?.length === 0 ? (
          <Text alignSelf={"end"}>
            <b>Atenção:</b> Você não possui cargos cadastrados
          </Text>
        ) : (
          <></>
        )}
      </Flex>

      <Flex w="1000px" gap={"5"}>
        <Box marginTop={"10px"} w="490px" h="367.65px">
          <video ref={webcamRef} autoPlay muted playsInline></video>
        </Box>

        <Box marginTop={"10px"}>
          {isLoading ? (
            <Box w="490px" h="367.65px" />
          ) : isProcessing ? (
            <Box w="490px" h="367.65px">
              <Image
                w="490px"
                h="367.65px"
                ref={processedRef}
                alt="Imagem processada"
              />
            </Box>
          ) : (
            <Box w="490px" h="367.65px">
              <video ref={webcamRefAux} autoPlay muted playsInline></video>
            </Box>
          )}
        </Box>
      </Flex>
      <Text alignSelf={"end"} mt={"10px"}>
        <b>Instruções:</b> Para uma maior eficiência do sistema mantenha uma
        distância de no mínimo 1 metro
      </Text>
    </Box>
  );
};

export default WebcamReader;
