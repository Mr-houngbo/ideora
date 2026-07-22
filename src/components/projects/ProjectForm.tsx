"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Loader2, Save, ArrowLeft, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  ProjectFormData,
  STATUS_LABELS,
  HORIZON_LABELS,
  CATEGORIES_ENTREPRISE,
  CATEGORIES_EDUCATION,
  ProjectStatus,
  TimeHorizon,
  Project,
  isEducationCategory,
} from "@/types/project";
import { cn } from "@/lib/utils";

type ProjectType = "entreprise" | "academique";

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (data: ProjectFormData, imageFile?: File) => Promise<void>;
  isLoading?: boolean;
  defaultCategory?: string;
}

const ProjectForm = ({ initialData, onSubmit, isLoading, defaultCategory }: ProjectFormProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitialType = (): ProjectType => {
    if (defaultCategory && isEducationCategory(defaultCategory)) return "academique";
    if (initialData?.categorie && isEducationCategory(initialData.categorie)) return "academique";
    return "entreprise";
  };

  const [projectType, setProjectType] = useState<ProjectType>(getInitialType());

  const getDefaultCategory = () => {
    if (defaultCategory) return defaultCategory;
    if (initialData?.categorie) return initialData.categorie;
    return projectType === "academique" ? CATEGORIES_EDUCATION[0] : CATEGORIES_ENTREPRISE[0];
  };

  const [formData, setFormData] = useState<ProjectFormData>({
    titre: initialData?.titre || "",
    categorie: getDefaultCategory(),
    description_courte: initialData?.description_courte || "",
    description_detaillee: initialData?.description_detaillee || "",
    statut: initialData?.statut || "idee",
    horizon_temps: initialData?.horizon_temps || "moyen_terme",
    tags: initialData?.tags || [],
    motivation: initialData?.motivation || "",
    ressources: initialData?.ressources || "",
    image_url: initialData?.image_url || null,
    contenu_riche: initialData?.contenu_riche || "",
    est_espace_travail: initialData?.est_espace_travail || false,
  });

  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);

  useEffect(() => {
    const newCategories = projectType === "academique" ? CATEGORIES_EDUCATION : CATEGORIES_ENTREPRISE;
    if (!newCategories.includes(formData.categorie)) {
      handleChange("categorie", newCategories[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectType]);

  const currentCategories = projectType === "academique" ? CATEGORIES_EDUCATION : CATEGORIES_ENTREPRISE;

  const handleChange = (field: keyof ProjectFormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange("tags", [...formData.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    handleChange(
      "tags",
      formData.tags.filter((t) => t !== tag)
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Fichier trop volumineux", {
          description: "L'image ne doit pas dépasser 5 Mo.",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    handleChange("image_url", null as unknown as string);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titre.trim()) {
      toast.error("Titre requis", {
        description: "Veuillez entrer un titre pour votre projet.",
      });
      return;
    }

    try {
      await onSubmit(formData, imageFile || undefined);
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de l'enregistrement.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6 card-premium overflow-hidden">
          <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Type de projet
          </Label>
          <div className="type-selector">
            <motion.button
              type="button"
              onClick={() => setProjectType("entreprise")}
              className={cn("type-option", projectType === "entreprise" && "selected")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="type-option-icon"
                style={{
                  background: projectType === "entreprise" ? "var(--gradient-primary)" : "hsl(var(--secondary))",
                }}
              >
                <Briefcase
                  className={cn("w-7 h-7", projectType === "entreprise" ? "text-primary-foreground" : "text-muted-foreground")}
                />
              </div>
              <div className="text-center">
                <p className={cn("font-semibold text-sm", projectType === "entreprise" ? "text-foreground" : "text-muted-foreground")}>
                  Entreprise
                </p>
                <p className="text-xs text-muted-foreground mt-1">Business, Tech, Créatif...</p>
              </div>
              {projectType === "entreprise" && (
                <motion.div
                  layoutId="type-indicator"
                  className="absolute -bottom-px left-0 right-0 h-1 rounded-full"
                  style={{ background: "var(--gradient-primary)" }}
                />
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setProjectType("academique")}
              className={cn("type-option", projectType === "academique" && "selected academic")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="type-option-icon"
                style={{
                  background: projectType === "academique" ? "var(--gradient-academic)" : "hsl(var(--secondary))",
                }}
              >
                <GraduationCap
                  className={cn("w-7 h-7", projectType === "academique" ? "text-academic-foreground" : "text-muted-foreground")}
                />
              </div>
              <div className="text-center">
                <p className={cn("font-semibold text-sm", projectType === "academique" ? "text-foreground" : "text-muted-foreground")}>
                  Académique
                </p>
                <p className="text-xs text-muted-foreground mt-1">Master, Certification...</p>
              </div>
              {projectType === "academique" && (
                <motion.div
                  layoutId="type-indicator"
                  className="absolute -bottom-px left-0 right-0 h-1 rounded-full"
                  style={{ background: "var(--gradient-academic)" }}
                />
              )}
            </motion.button>
          </div>
        </Card>

        <Card className="p-6 card-premium">
          <Label className="text-base font-semibold mb-4 block">Image du projet</Label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer
              transition-all duration-300 hover:border-primary/50 hover:bg-primary/5
              ${imagePreview ? "border-transparent" : "border-border"}
            `}
          >
            {imagePreview ? (
              <div className="relative aspect-video">
                <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  className="absolute top-3 right-3 shadow-lg backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: projectType === "academique" ? "var(--gradient-academic)" : "var(--gradient-primary)" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <ImageIcon className="w-8 h-8 text-primary-foreground" />
                </motion.div>
                <p className="text-sm font-semibold text-foreground mb-1">Cliquez pour ajouter une image</p>
                <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 5 Mo</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </Card>

        <Card className="p-6 space-y-6 card-premium">
          <div className="space-y-2">
            <Label htmlFor="titre" className="font-semibold">
              Titre *
            </Label>
            <Input
              id="titre"
              value={formData.titre}
              onChange={(e) => handleChange("titre", e.target.value)}
              placeholder="Mon projet ambitieux..."
              className="h-12 text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold">Catégorie</Label>
              <Select value={formData.categorie} onValueChange={(value) => handleChange("categorie", value)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Statut</Label>
              <Select value={formData.statut} onValueChange={(value) => handleChange("statut", value as ProjectStatus)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Horizon</Label>
              <Select value={formData.horizon_temps} onValueChange={(value) => handleChange("horizon_temps", value as TimeHorizon)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(HORIZON_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_courte" className="font-semibold">
              Description courte
            </Label>
            <Input
              id="description_courte"
              value={formData.description_courte}
              onChange={(e) => handleChange("description_courte", e.target.value)}
              placeholder="Une phrase qui résume le projet..."
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_detaillee" className="font-semibold">
              Description détaillée
            </Label>
            <Textarea
              id="description_detaillee"
              value={formData.description_detaillee}
              onChange={(e) => handleChange("description_detaillee", e.target.value)}
              placeholder="Décrivez votre projet en détail..."
              className="min-h-[150px] resize-none"
            />
          </div>
        </Card>

        <Card className="p-6 space-y-6 card-premium">
          <div className="space-y-2">
            <Label className="font-semibold">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Ajouter un tag..."
                className="h-12"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={handleAddTag} className="h-12 px-6">
                Ajouter
              </Button>
            </div>
            <AnimatePresence>
              {formData.tags.length > 0 && (
                <motion.div className="flex flex-wrap gap-2 mt-3" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  {formData.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="tag-chip"
                    >
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 hover:text-destructive transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivation" className="font-semibold">
              Motivation
            </Label>
            <Textarea
              id="motivation"
              value={formData.motivation}
              onChange={(e) => handleChange("motivation", e.target.value)}
              placeholder="Pourquoi ce projet vous tient à cœur..."
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ressources" className="font-semibold">
              Ressources
            </Label>
            <Textarea
              id="ressources"
              value={formData.ressources}
              onChange={(e) => handleChange("ressources", e.target.value)}
              placeholder="Liens, outils, références utiles..."
              className="resize-none"
            />
          </div>

        </Card>

        <Card className="p-6 space-y-6 card-premium">
          <div className="space-y-2">
            <Label htmlFor="contenu_riche" className="font-semibold">
              Contenu riche (Markdown)
            </Label>
            <p className="text-xs text-muted-foreground">
              Pour les projets qui méritent plus de profondeur : sections, listes, tableaux, citations — écrit en
              Markdown, affiché en dessous de la description sur la fiche du projet.
            </p>
            <Textarea
              id="contenu_riche"
              value={formData.contenu_riche}
              onChange={(e) => handleChange("contenu_riche", e.target.value)}
              placeholder={"## Vision\n\nDécrivez ici tout ce que vous voulez, en Markdown..."}
              className="min-h-[220px] font-mono text-sm"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="est_espace_travail"
              checked={formData.est_espace_travail}
              onChange={(e) => handleChange("est_espace_travail", e.target.checked)}
              className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary cursor-pointer"
            />
            <Label htmlFor="est_espace_travail" className="cursor-pointer font-medium">
              Activer l&apos;espace de travail avancé (initiatives, contacts, roadmap, bibliothèque...)
            </Label>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()} className="sm:order-1 h-12">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button type="submit" variant="gradient" size="lg" disabled={isLoading} className="sm:order-2 h-12 min-w-[180px]">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {initialData ? "Mettre à jour" : "Créer le projet"}
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProjectForm;
