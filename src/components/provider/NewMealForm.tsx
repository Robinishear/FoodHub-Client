"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Category, Meal } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { uploadService } from "@/services/uploadService"
import { ImagePlus, Package, DollarSign, FileText, CheckCircle2, XCircle, Loader2, Trash2 } from "lucide-react"
import { toast } from "react-hot-toast"

interface NewMealFormProps {
  initialData?: Meal
  categories: Category[]
  onSubmit: (data: {
    title: string;
    description: string;
    price: number;
    image: string;
    categoryId: string;
    isAvailable: boolean;
  }) => Promise<void>
  isLoading: boolean
  onCancel: () => void
}

export function NewMealForm({
  initialData,
  categories,
  onSubmit,
  isLoading,
  onCancel,
}: NewMealFormProps) {
  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    image: initialData?.image || "",
    categoryId:
      initialData?.categoryId || (categories.length > 0 ? categories[0].id : ""),
    isAvailable: initialData?.isAvailable ?? true,
  }))
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [selectedImageName, setSelectedImageName] = useState<string>("")
  const [fileInputKey, setFileInputKey] = useState(0)

  // Keep form state in sync when switching between create/edit or changing target meal
  useEffect(() => {
    setFormData({
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price?.toString() || "",
      image: initialData?.image || "",
      categoryId:
        initialData?.categoryId || (categories.length > 0 ? categories[0].id : ""),
      isAvailable: initialData?.isAvailable ?? true,
    })
    setSelectedImageName("")
    setIsUploadingImage(false)
    setFileInputKey((k) => k + 1)
  }, [initialData?.id, categories])

  const imagePreview = useMemo(() => {
    const url = formData.image?.trim()
    return url ? url : ""
  }, [formData.image])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price),
    }
    await onSubmit(submissionData)
  }

  const handlePickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedImageName(file.name)
    setIsUploadingImage(true)
    try {
      const uploaded = await uploadService.uploadImage(file, "meals")
      setFormData((prev) => ({ ...prev, image: uploaded.secureUrl }))
      toast.success("Image uploaded")
    } catch (err: any) {
      toast.error(err?.userMessage || "Failed to upload image")
    } finally {
      setIsUploadingImage(false)
      // allow re-selecting same file
      e.target.value = ""
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center">
              <Package size={16} className="mr-2 text-orange-500" />
              Meal Title
            </label>
            <Input
              name="title"
              placeholder="e.g. Spicy Grilled Chicken"
              value={formData.title}
              onChange={handleChange}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center">
              <DollarSign size={16} className="mr-2 text-orange-500" />
              Price (TK)
            </label>
            <Input
              name="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center">
              <FileText size={16} className="mr-2 text-orange-500" />
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe your delicious meal..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center">
              <ImagePlus size={16} className="mr-2 text-orange-500" />
              Meal Image
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  key={fileInputKey}
                  type="file"
                  accept="image/*"
                  onChange={handlePickImage}
                  disabled={isLoading || isUploadingImage}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-950 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-orange-500"
                />
                {isUploadingImage && <Loader2 size={18} className="animate-spin text-orange-500" />}
              </div>
              {selectedImageName && (
                <p className="text-[11px] font-bold text-gray-400">Selected: {selectedImageName}</p>
              )}

              {imagePreview ? (
                <div className="rounded-md border border-gray-100 bg-gray-50 p-3 flex items-center gap-3">
                  <img src={imagePreview} alt="Meal preview" className="h-16 w-16 rounded-md object-cover border" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-700 truncate">Uploaded</p>
                    <p className="text-[11px] text-gray-400 truncate">{imagePreview}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isLoading || isUploadingImage}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, image: "" }))
                      setSelectedImageName("")
                      setFileInputKey((k) => k + 1)
                    }}
                    className="ml-auto"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <p className="text-[11px] text-gray-400 font-medium">No image uploaded (optional).</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center">
              Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full h-12 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="isAvailable" className="text-sm font-bold text-gray-700">
              Mark as Available for Order
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="h-12 px-6 font-bold"
        >
          <XCircle size={18} className="mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="h-12 px-8 font-bold"
        >
          <CheckCircle2 size={18} className="mr-2" />
          {initialData ? "Update Meal" : "Add to Menu"}
        </Button>
      </div>
    </form>
  )
}
