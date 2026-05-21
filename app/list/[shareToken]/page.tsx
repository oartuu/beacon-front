"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Share2, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { QRCode } from "react-qr-code";

interface PageProps {
  params: Promise<{
    shareToken: string;
  }>;
}

export interface Response {
  id: string;
  name: string;
  classId: string;
  isOpen: boolean;
  shareToken: string;
  secret: any;
  codeWindow: number;
  createdAt: string;
  itens: Item[];
}

export interface ClassResponse {
  id: string;
  name: string;
  professorId: string;
  createdAt: string
}
export interface Item {
  id: string;
  listId: string;
  name: string;
  registration_number: string;
  createdAt: string;
}

interface TableData {
  name: string;
  registration_number: string;
  origin:string;
  date: string;
}

export default function page({ params }: PageProps) {
  const { shareToken } = use(params);
  const router = useRouter();
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [listName, setListName] = useState("");
  const [className, setClassName] = useState("");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const shareLink = `https://beacon-api-liart.vercel.app/list/validation/${shareToken}`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // sem token
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const response = await fetch(
          `https://beacon-api-liart.vercel.app/list/${shareToken}`,
        );
        const data: Response = await response.json();

        setListName(data.name);

        const classFetch = await fetch(
          `https://beacon-api-liart.vercel.app/class/${data.classId}`,
        );

        const classData:ClassResponse= await classFetch.json()

        setClassName(classData.name);

        // pega apenas os itens
        const rows = data.itens
          .sort((a: any, b: any) =>
            a.name.localeCompare(b.name, "pt-BR", {
              sensitivity: "base",
            }),
          )
          .map((item: any) => ({
            name: item.name,
            registration_number: item.registration_number,
            date: new Date(item.createdAt).toLocaleString("pt-BR"),
            origin:item.origin
          }));

        setTableData(rows);
      } catch (error) {}
    };
    fetchData();
  });
   const handleShareList = () => {
     setIsShareDialogOpen(true);
   };

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
          Origem:item.origin
        }));

      // cria planilha
      const worksheet = XLSX.utils.json_to_sheet(rows);

      // cria workbook
      const workbook = XLSX.utils.book_new();

      // adiciona worksheet
      XLSX.utils.book_append_sheet(workbook, worksheet, "Lista");

      // download do arquivo
      XLSX.writeFile(workbook, `${className}-${data.name}.xlsx`);
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
                <BreadcrumbLink asChild>
                  <Link
                    href="/class"
                    className="text-zinc-300 hover:text-zinc-100"
                  >
                    {className}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-zinc-100">
                  {listName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex gap-2">
          <Button
            size={"lg"}
            onClick={exportToExcel}
            className=" flex justify-between hover:cursor-pointer hover:text-zinc-100 bg-zinc-100 text-zinc-900"
          >
            <SquareArrowOutUpRight />
            Exportar
          </Button>

          <Button
            size={"lg"}
            onClick={handleShareList}
            className=" flex justify-between hover:cursor-pointer hover:text-zinc-100 bg-zinc-100 text-zinc-900"
          >
            <Share2 />
            Compartilhar
          </Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col gap-2 p-4 overflow-auto ">
        <h1>Total de Registros: {tableData.length}</h1>
        <Table className="mt-2  ">
          <TableHeader>
            <TableRow>
              <TableHead className="border-r ">NOME:</TableHead>
              <TableHead className="border-r">MATRÍCULA:</TableHead>
              <TableHead className="text-right">DATA:</TableHead>
              <TableHead className="text-right">ORIGEM:</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((r) => (
              <TableRow key={r.registration_number}>
                <TableCell className="border-r">{r.name}</TableCell>
                <TableCell className="border-r">
                  {r.registration_number}
                </TableCell>
                <TableCell className="text-right border-r">{r.date}</TableCell>
                <TableCell className="text-right">{r.origin}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent className="dark:bg-zinc-200 dark:text-zinc-900">
            <DialogHeader>
              <DialogTitle>Compartilhar lista</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center gap-2">
              <QRCode className="rounded-xl" value={shareLink} />
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
