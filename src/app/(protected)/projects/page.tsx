import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const ProjectsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tus proyectos de software y sus estimaciones asociadas.
          </p>
        </div>
        <Link href="/projects/new" className={buttonVariants()}>
          Nuevo proyecto
        </Link>
      </div>
    </div>
  );
};

export default ProjectsPage;
