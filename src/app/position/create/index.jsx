import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Link,
  ListItem,
  Spinner,
  Text,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useEffect, useRef, useState } from "react";
import { apiConnection } from "../../services/apiConnection";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/nav/Navbar";
import { apiIdentificationConnection } from "../../services/apiIdentificationConnection";
import { Link as ReachLink } from "react-router-dom";

export default function CreatePosition() {
  const navigate = useNavigate();
  const positionId = new URLSearchParams(window.location.search).get("id");

  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "credentials",
    "userData",
    "company",
  ]);

  const toast = useToast();

  const [imageData, setImageData] = useState();
  const [editablePosition, setEditablePosition] = useState(false);
  const [positionImageUrl, setPositionImageUrl] = useState();

  const companySchema = yup.object().shape({
    name: yup.string().required("Nome do cargo é obrigatório."),
    description: yup.string(),
    companyId: yup.string(),
    color: yup.string().required("Cor é obrigatória."),
    rgb: yup.string().required("RGB é obrigatória."),
    imageBuffered: yup.string(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(companySchema),
  });

  useEffect(() => {
    async function populatePositionData() {
      try {
        const responsePositions = await apiConnection.get(
          `/positions/${positionId}`,
          {
            headers: {
              Authorization: cookies.token,
            },
          }
        );

        const { data } = responsePositions;
        setValue("name", data.name);
        setValue("description", data.description);
        setValue("color", data.color);
        setValue("rgb", data.rgb);
        setPositionImageUrl(data.uniformUrl);
      } catch (error) {
        if (error.response.status === 404) {
          navigate("/position");
        }
      }
    }

    if (!!positionId) {
      setEditablePosition(true);
      populatePositionData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionId]);

  useEffect(() => {
    setValue("companyId", cookies.company.id);
  }, [cookies.company, setValue]);

  useEffect(() => {
    if (!!imageData) {
      const imageMetadata = imageData.detections[0];
      setValue("color", imageMetadata?.color);

      const formattedRgb = `rgb(${imageMetadata?.color_rgb.r}, ${imageMetadata?.color_rgb.g}, ${imageMetadata?.color_rgb.b})`;
      setValue("rgb", imageMetadata?.color ? formattedRgb : null);
      setValue("imageBuffered", imageData.image);
    }
  }, [imageData, setValue]);

  const onValid = async (object) => {
    try {
      if (editablePosition) {
        await apiConnection.put(`/positions/${positionId}`, object, {
          headers: {
            Authorization: cookies.token,
          },
        });
      } else {
        await apiConnection.post("/positions", object, {
          headers: {
            Authorization: cookies.token,
          },
        });
      }

      toast({
        title: "Processamento concluído.",
        description: "O processamento foi realizado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/identifier");
    } catch (error) {
      console.error("Erro ao cadastrar empresa", error);
      toast({
        title: "Erro ao processar empresa.",
        description: "Tente novamente mais tarde.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onInvalid = (data) => {
    for (const key in data) {
      toast({
        title: "Erro ao cadastrar empresa.",
        description: data[key].message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH={"110vh"} minW="100vh">
      <NavBar />

      <Heading
        fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
        textAlign="center"
        paddingTop={"2rem"}
      >
        <Text>Cadastro de cargos</Text>
      </Heading>

      <Box mt={"10px"}>
        <Text textAlign="left" maxW={"600px"} margin={"auto"}>
          Primeiro, envie uma imagem para detecção automática da cor do seu
          uniforme <b>contendo somente ela</b>. Em seguida, preencha as
          informações necessárias. Siga as seguintes <b>recomendações</b>:
        </Text>
      </Box>

      <Flex maxW={"600px"} justify="left" margin={"auto"}>
        <Box>
          <UnorderedList>
            <ListItem>
              A imagem deve contem apenas <b>uma pessoa</b>.{" "}
              <Link as={ReachLink} to="/position/example">
                Veja exemplos.
              </Link>
            </ListItem>
            <ListItem>
              Capture a imagem no <b>mesmo ambiente</b> que a camera ficará
              localizada.
            </ListItem>
            <ListItem>
              Certifique-se de que o ambiente esteja com as{" "}
              <b>condições usuais</b> de iluminação.
            </ListItem>
          </UnorderedList>
        </Box>
      </Flex>

      <Flex
        flexDir={"column"}
        alignItems={"center"}
        w="100%"
        h="100%"
        marginTop={"30px"}
      >
        <ImageUploader
          setImageData={setImageData}
          imageUrl={positionImageUrl}
        />

        <form
          onSubmit={handleSubmit(onValid, onInvalid)}
          style={{
            width: "45%",
          }}
        >
          <Text fontSize={"12px"}>*Nome do cargo:</Text>
          <Input
            type="text"
            mt={"3px"}
            placeholder="Digite o nome do cargo"
            {...register("name")}
            isInvalid={errors.name}
          />

          <Text mt={"20px"} fontSize={"12px"}>
            Descrição:
          </Text>
          <Input
            type="text"
            mt={"3px"}
            placeholder="Digite a descrição do cargo"
            {...register("description")}
            isInvalid={errors.description}
          />

          <Text mt={"20px"} fontSize={"12px"}>
            *Cor:
          </Text>
          <Input
            type="text"
            mt={"3px"}
            placeholder="Envie uma imagem"
            {...register("color")}
            isInvalid={errors.color}
            disabled={true}
          />

          <Text mt={"20px"} fontSize={"12px"}>
            *Valor RGB:
          </Text>
          <Input
            type="text"
            mt={"3px"}
            placeholder="Envie uma imagem"
            {...register("rgb")}
            isInvalid={errors.rgb}
            disabled={true}
          />

          <Button type="submit" w="100%" mt={"20px"} fontSize="13px">
            {isSubmitting ? (
              <>
                <Spinner />{" "}
              </>
            ) : editablePosition ? (
              "Atualizar cadastro"
            ) : (
              "Criar cadastro"
            )}
          </Button>
        </form>
      </Flex>
    </Box>
  );
}

const ImageUploader = ({ setImageData, imageUrl }) => {
  const [imageFile, setImageFile] = useState(null);
  const processedRef = useRef(null);
  const toast = useToast();

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  useEffect(() => {
    const elemento = document.getElementById("image-ref");
    processedRef.current = elemento;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast({
        title: "Falha no envio.",
        description: "Selecione uma imagem antes de enviar.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await apiIdentificationConnection.post(
        "/process",
        formData
      );

      setImageData(response.data);
      const base64Image = `data:image/jpeg;base64,${response.data.image}`;
      processedRef.current.src = base64Image;
    } catch (error) {
      console.error("Erro ao processar a imagem:", error);
    }
  };

  return (
    <Flex flexDir={"column"} alignItems={"center"} w="100%" h="100%">
      <form onSubmit={handleSubmit}>
        <Box display={"grid"} gap={"5"}>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
          />

          <Button type="submit">Enviar Imagem</Button>
        </Box>
      </form>

      <Image
        src={
          !!imageUrl
            ? imageUrl
            : "https://upload.wikimedia.org/wikipedia/commons/1/17/Warning.svg"
        }
        id="image-ref"
        ref={processedRef}
        alt="Imagem processada"
        style={{ maxWidth: "100px", marginTop: "1rem" }}
      />
    </Flex>
  );
};
