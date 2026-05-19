"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CirclePlus, NotebookTabs, Plus, School } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import * as XLSX from "xlsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ClassResponse } from "@/app/list/[shareToken]/page";
interface PageProps {
  params: Promise<{
    classId: string;
  }>;
}

type List = {
  id: string;
  name: string;
  classId: string;
  isOpen: boolean;
  shareToken: string;
  secret: any;
  codeWindow: number;
  createdAt: string;
};
type Inputs = {
  name: string;
};
export default function page({ params }: PageProps) {
  const { classId } = use(params);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [lists, setLists] = useState<List[]>([]);
  const [className, setClassName] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const [shareToken, setShareToken] = useState("");
  const shareLink = `https://beacon4u.vercel.app/list/send/${shareToken}`;
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = localStorage.getItem("token");

        // sem token
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const res = await fetch(
          "https://beacon-api-liart.vercel.app/class/lists",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              classId: classId,
            }),
          },
        );

        // token expirado/inválido
        if (res.status === 401) {
          localStorage.removeItem("token");

          router.push("/auth/login");
          return;
        }

        // outros erros
        if (!res.ok) {
          throw new Error("Erro ao buscar listas");
        }

        const jsonData = await res.json();

        setLists(jsonData);

          const classFetch = await fetch(
          `https://beacon-api-liart.vercel.app/class/${jsonData[0].classId}`,
        );

        const classData:ClassResponse = await classFetch.json()
        
        setClassName(classData.name)


      } catch (error) {
        console.error(error);
      }
    };

    fetchLists();
  }, [classId, router]);

  const exportToExcel = async () => {
    const response = await fetch(
      `https://beacon-api-liart.vercel.app/list/${shareToken}`,
    );
    const data = await response.json();

    // pega apenas os itens
    const rows = data.itens
      .sort((a: any, b: any) =>
        a.name.localeCompare(b.name, "pt-BR", {
          sensitivity: "base",
        }),
      )
      .map((item: any) => ({
        Nome: item.name,
        Matricula: item.registration_number,
        Data: new Date(item.createdAt).toLocaleString("pt-BR"),
      }));

    // cria planilha
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // cria workbook
    const workbook = XLSX.utils.book_new();

    // adiciona worksheet
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lista");

    // download do arquivo
    XLSX.writeFile(workbook, `${data.name}.xlsx`);
  };

  const onSubmit = async (formData: Inputs) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://beacon-api-liart.vercel.app/list/create",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            classId: classId,
          }),
        },
      );

      if (!res) {
        console.log("erro criando lista");
        return;
      }
      setIsDialogOpen(false);
      window.location.reload();
    } catch (err) {}
  };

  const handleShareList = (shareToken: string) => {
    setIsListDialogOpen(true);
    setShareToken(shareToken);
  };
  return (
    <div className="h-dvh flex flex-col bg-zinc-100 dark:bg-zinc-900 ">
      <header className="bg-zinc-800 w-full px-4 h-18 flex justify-between items-center shadow-md">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/class"
                    className="text-zinc-300 hover:text-zinc-100"
                  >
                    Turmas
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-zinc-100">
                 {className}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div>
          <Button
            size={"lg"}
            className=" flex justify-between hover:cursor-pointer bg-zinc-100 text-zinc-900"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus />
            Nova Lista
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-2  p-4 overflow-auto">
        {lists.map((l) => (
          <Item key={l.id} variant="muted" className=" shadow-lg " asChild>
            <Link  href={`/list/${l.shareToken}`}>
              <ItemMedia variant="icon">
                <NotebookTabs/>
              </ItemMedia>
              <ItemContent >
                <ItemTitle >{l.name}</ItemTitle>
                <ItemDescription>
                  class name
                </ItemDescription>
              </ItemContent>
            </Link>
          </Item>
        ))}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar nova lista</DialogTitle>
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
        <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compartilhar lista</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center gap-2">
              <QRCode value={shareLink} />

              <Button
                onClick={exportToExcel}
                className="w-full mt-2 hover:cursor-pointer"
              >
                Exportar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
