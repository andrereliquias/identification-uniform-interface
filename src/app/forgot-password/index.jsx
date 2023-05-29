import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { apiConnection } from "../services/apiConnection";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function ForgotPassword() {
  const toast = useToast();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "credentials",
    "userData",
  ]);
  const loginSchema = yup.object().shape({
    email: yup.string().required("E-mail é obrigatório."),
    password: yup.string().required("Senha é obrigatória."),
    confirmPassword: yup.string().required("Repita a senha novamente."),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onValid = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Erro ao alterar a senha.",
        description: "As senhas não se coincidem.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      reset();
      return;
    }

    delete data.confirmPassword;

    try {
      await apiConnection.post("/forgot-password", data);

      removeCookie("credentials");
      removeCookie("userData");
      removeCookie("token");

      toast({
        title: "Alteração de senha realizada com sucesso.",
        description: "Faça login para continuar.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/login");
    } catch (error) {
      console.error("Erro ao realizar login", error);

      if (error.response.status === 404) {
        toast({
          title: "Erro ao alterar a senha.",
          description: "Usuário nao encontrado.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Erro ao alterar a senha.",
          description: "Tente novamente mais tarde.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      reset();
    }
  };

  const onInvalid = (data) => {
    for (const key in data) {
      toast({
        title: "Erro ao alterar a senha.",
        description: data[key].message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH={"100vh"} minW="100vh">
      <Heading
        fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
        textAlign="center"
        paddingTop={"5rem"}
      >
        <Text>Recupere a sua senha</Text>
      </Heading>

      <Flex
        mt={"70px"}
        flexDir={"column"}
        alignItems={"center"}
        w="100%"
        h="100%"
      >
        <form
          onSubmit={handleSubmit(onValid, onInvalid)}
          style={{
            width: "45%",
          }}
        >
          <Text fontSize={"12px"}>E-mail:</Text>
          <Input
            type="email"
            mt={"3px"}
            placeholder="Digite o seu email"
            {...register("email")}
            isInvalid={errors.email}
          />

          <Text mt={"20px"} fontSize={"12px"}>
            Nova senha:
          </Text>
          <Input
            type="password"
            placeholder="Digite a nova senha"
            mt={"3px"}
            {...register("password")}
            isInvalid={errors.password}
          />

          <Text mt={"20px"} fontSize={"12px"}>
            Confirme a senha:
          </Text>
          <Input
            type="password"
            placeholder="Confirme a nova senha"
            mt={"3px"}
            {...register("confirmPassword")}
            isInvalid={errors.confirmPassword}
          />

          <Button type="submit" w="100%" mt={"20px"} fontSize="13px">
            {isSubmitting ? (
              <>
                <Spinner />{" "}
              </>
            ) : (
              "Alterar"
            )}
          </Button>
        </form>
      </Flex>
    </Box>
  );
}
