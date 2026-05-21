"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight, CirclePlus, School } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getToken,logout } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";


type Class = {
  id: string;
  name: string;
  professorId: string;
  createdAt: string;
};
type Inputs = {
  name: string;
};
export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [classes, setClasses] = useState<Class[]>([]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = getToken();

        // sem token → login
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const res = await fetch("https://beacon-api-liart.vercel.app/class/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // token expirado/inválido
        if (res.status === 401) {
          logout();
          router.push("/auth/login");
          return;
        }

        // qualquer outro erro
        if (!res.ok) {
          throw new Error("Erro ao buscar turmas");
        }

        const jsonData = await res.json();

        setClasses(jsonData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClasses();
  }, [router]);

  const onSubmit = async (formData: Inputs) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://beacon-api-liart.vercel.app/class/create",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
          }),
        },
      );

      if (!res) {
        console.log("erro criando turma");
        return;
      }
      setIsDialogOpen(false);
      window.location.reload();
    } catch (err) {}
  };

  const navigateToClass = (classId: string) => {
    router.push(`/class/${classId}`);
  };

  return (
    <div className="h-dvh flex flex-col bg-zinc-100 dark:bg-zinc-900">
      <header className="bg-zinc-800 w-full h-18 px-2 flex justify-between items-center shadow-md">
        <div className="">
          <img src="beacon.svg" alt="aaaaaaaaa" className="h-12" />
        </div>
        <div>
          <input
            className="bg-zinc-50 text-zinc-950 w-xl p-2 rounded-sm shadow-md "
            type="text"
            placeholder="pesquisar turma"
          />
        </div>
        <Button
          size={"lg"}
          onClick={() => setIsDialogOpen(true)}
          className=" flex justify-between hover:cursor-pointer hover:text-zinc-100 bg-zinc-100 text-zinc-900 pr-4"
        >
          Nova Turma <CirclePlus />
        </Button>
      </header>

      <main className="flex-1 flex flex-col flex-wrap items-start content-start  gap-2  p-4 overflow-auto">
        <h1 className="px-4 mt-2">Turmas cadastradas: </h1>
        <Separator className="dark:bg-zinc-500" />
        <div className=" w-full flex flex-wrap items-start content-start  gap-2  overflow-auto">
          {classes.map((c) => (
            <Card
              onClick={() => navigateToClass(c.id)}
              key={c.id}
              className="w-3/12 border dark:bg-zinc-900 border-zinc-200 dark:border-zinc-500 hover:cursor-pointer"
            >
              <CardContent className="flex gap-4 items-center justify-between ">
                <div className="flex gap-2">
                  <p className="text-base">{c.name}</p>
                  <School />
                </div>
                <div className="flex gap-2">
                  <Separator orientation="vertical" />
                  <ChevronRight />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar nova turma</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name">Nome</label>
                <input
                  className="shadow-md border rounded-lg px-4 py-2 "
                  type="name"
                  {...register("name", { required: "o nome é obrigatório" })}
                  placeholder="Insira o nome da lista"
                />
                {errors.name && (
                  <span className="ml-2 text-xs font-light text-red-600 dark:text-red-400">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="w-full mt-2 hover:cursor-pointer"
              >
                Criar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
