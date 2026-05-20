"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  CheckCircle2,
  FileSpreadsheet,
  QrCode,
  School,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const handleRedirect = (route: string) => {
    router.push(route);
  };

  const features = [
    {
      icon: School,
      title: "Organize suas turmas",
      desc: "Crie múltiplas turmas para separar disciplinas, horários e classes de maneira simples.",
    },
    {
      icon: QrCode,
      title: "QR Code para presença",
      desc: "Compartilhe um QR Code único para os alunos responderem a chamada rapidamente.",
    },
    {
      icon: FileSpreadsheet,
      title: "Exportação em Excel",
      desc: "Baixe listas completas com nome, matrícula, data e horário das presenças.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Crie sua conta",
      desc: "Professores podem se registrar e acessar a plataforma em poucos segundos.",
    },
    {
      number: "02",
      title: "Cadastre suas turmas",
      desc: "Organize diferentes classes e mantenha tudo separado e acessível.",
    },
    {
      number: "03",
      title: "Gere uma nova chamada",
      desc: "Crie uma lista de presença e compartilhe o QR Code com os alunos.",
    },
    {
      number: "04",
      title: "Exporte os registros",
      desc: "Baixe a ata em Excel com todos os dados registrados automaticamente.",
    },
  ];

  return (
    <main className="min-h-screen max-w-dvw bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-100 overflow-x-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2  md:w-175 w-sm h-175 bg-zinc-300/50 dark:bg-zinc-800/50 blur-3xl rounded-full pointer-events-none" />

      {/* HERO */}
      <section className="relative w-full px-6 py-28 flex flex-col items-center text-center overflow-hidden">
        <div className="max-w-5xl flex flex-col items-center gap-8">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-500 px-4 py-2 rounded-full text-sm text-zinc-600 dark:text-zinc-300 shadow-sm">
            Plataforma moderna para chamadas virtuais
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
            Automatize suas listas de presença com QR Code.
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Crie turmas, gere chamadas digitais e exporte listas de presença
            completas em Excel de forma rápida e organizada.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={() => handleRedirect("/auth/register")}
              className="rounded-2xl px-8 py-6 bg-zinc-950 text-zinc-100 hover:bg-zinc-800 cursor-pointer"
            >
              Começar gratuitamente
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => handleRedirect("/auth/login")}
              className="rounded-2xl px-8 py-6 border-zinc-300 bg-white hover:bg-zinc-200 cursor-pointer"
            >
              Já tenho conta
            </Button>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="mt-24 w-full max-w-6xl">
          <div className="relative rounded-3xl border border-zinc-200 dark:border-zinc-500 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-zinc-200/30 dark:from-zinc-800/30 to-transparent pointer-events-none" />

            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              {/* Left Side */}
              <div className="space-y-6">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-500">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">
                      Turmas cadastradas
                    </h3>

                    <Users className="w-5 h-5 text-zinc-500 dark:text-zinc-100" />
                  </div>

                  <div className="space-y-3">
                    {[
                      "ADS - 3º Período",
                      "Banco de Dados",
                      "Estrutura de Dados",
                      "Programação Web",
                    ].map((classroom) => (
                      <div
                        key={classroom}
                        className="flex items-center justify-between bg-white dark:bg-zinc-700 rounded-xl px-4 py-3 border border-zinc-200 dark:border-zinc-500"
                      >
                        <span>{classroom}</span>

                        <CheckCircle2 className="w-5 h-5 text-zinc-700" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex flex-col gap-6 ">
                <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-500 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <QrCode className="w-6 h-6" />

                    <h4 className="font-semibold text-lg">QR Code gerado</h4>
                  </div>

                  <div className="bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-500 rounded-2xl h-52 flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-zinc-700 dark:text-zinc-300" />
                  </div>
                </div>

                <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-500 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <FileSpreadsheet className="w-6 h-6" />

                    <h4 className="font-semibold text-lg">
                      Exportação simplificada
                    </h4>
                  </div>

                  <p className="text-zinc-600 dark:text-zinc-300">
                    Exporte automaticamente listas de presença completas em
                    formato Excel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="w-full max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Tudo que você precisa para controlar presenças
          </h2>

          <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            Uma solução simples para professores organizarem chamadas digitais
            sem burocracia.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <Card
                key={i}
                className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-500 rounded-3xl shadow-sm"
              >
                <CardContent className="p-8 flex flex-col gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-zinc-900 dark:text-zinc-100" />
                  </div>

                  <h3 className="text-2xl font-semibold">{feature.title}</h3>

                  <p className="text-zinc-600 dark:text-zinc-300  leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full bg-white dark:bg-zinc-800 border-y border-zinc-200 dark:border-zinc-500 ">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Como funciona
            </h2>

            <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
              O fluxo foi pensado para ser rápido, intuitivo e eficiente no dia
              a dia do professor.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-500 rounded-3xl p-8"
              >
                <span className="text-zinc-500 dark:text-zinc-200 text-sm font-medium">
                  PASSO {step.number}
                </span>

                <h3 className="text-2xl font-semibold mt-3 mb-4">
                  {step.title}
                </h3>

                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-6 py-28 flex justify-center">
        <div className="max-w-5xl w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-500 rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-linear-to-r from-zinc-200/20 dark:from-zinc-800/20 to-transparent pointer-events-none" />

          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Modernize suas chamadas hoje.
          </h2>

          <p className="text-zinc-600 dark:text-zinc-300 text-lg max-w-2xl mx-auto mb-10">
            Crie sua conta gratuitamente e organize listas de presença com QR
            Code e exportação em Excel.
          </p>

          <Button
            size="lg"
            onClick={() => handleRedirect("/auth/register")}
            className="rounded-2xl px-10 py-7 text-lg bg-zinc-950 text-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer"
          >
            Criar minha conta
          </Button>
        </div>
      </section>
    </main>
  );
}
