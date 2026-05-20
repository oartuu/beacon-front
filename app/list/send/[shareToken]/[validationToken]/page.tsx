"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useForm } from "react-hook-form";

interface PageProps {
  params: Promise<{
    shareToken: string;
    validationToken: string;
  }>;
}

type Inputs = {
  name: string
  registration_number: string
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const [error, setError] = useState(false);
  const { shareToken, validationToken } = use(params);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();


  const onSubmit = async (formData:Inputs) => {

    try {
      const response = await fetch(
        `https://beacon-api-liart.vercel.app/list/${shareToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name:formData.name,
            registration_number:formData.registration_number,
            validationToken: validationToken,
          }),
        },
      );

      console.log("response", response);

      if (!response.ok) {
        setError(true);
        return;
      }

      router.replace("/list/done/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="h-dvh bg-black flex items-center justify-center">
      <Card className="md:w-1/3 w-[95%]">
        <CardHeader>Enviar Presença:</CardHeader>

        {error && (
          <div className="px-4">
            <p>matrícula ou senha inválidas</p>
          </div>
        )}

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="registration_number">Matrícula</label>

              <input
                className="shadow-md border rounded-lg px-4 py-2 "
                type="text"
                {...register("registration_number", { required: true })}
                placeholder="Insira sua matrícula"
              />
              {errors.registration_number && (
                <span className="ml-2 text-xs font-light text-red-600 dark:text-red-400">
                  Este campo é obrigatório
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="name">Nome</label>

              <input
                className="shadow-md border rounded-lg px-4 py-2 "
                type="text"
                {...register("name", { required: true })}
                placeholder="Insira seu nome"
              />
              {errors.name && (
                <span className="ml-2 text-xs font-light text-red-600 dark:text-red-400">
                  Este campo é obrigatório
                </span>
              )}
            </div>

            <Button type="submit" className="mt-2">
              Enviar
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
