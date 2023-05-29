import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Login, SignIn, ForgotPassword, CreatePosition, ListPosition, PlotGraph, Example } from "./app/index";
import Identifier from "./app/identifier";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "./app/contexts/AuthContext";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider resetCSS>
        <Router>
          <AuthProvider>
            <Routes>
              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/signin"
                element={<SignIn />}
              />

              <Route
                path="/forgot-password"
                element={<ForgotPassword />}
              />

              <Route
                path="/identifier"
                element={
                  <PrivateRoute>
                    <Identifier />
                  </PrivateRoute>}
              />

              <Route
                path="/position"
                element={
                  <PrivateRoute>
                    <CreatePosition />
                  </PrivateRoute>}
              />

              <Route
                path="/position/list"
                element={
                  <PrivateRoute>
                    <ListPosition />
                  </PrivateRoute>}
              />

              <Route
                path="/position/example"
                element={
                  <PrivateRoute>
                    <Example />
                  </PrivateRoute>}
              />

              <Route
                path="/position/plot"
                element={
                  <PrivateRoute>
                    <PlotGraph />
                  </PrivateRoute>}
              />

              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
