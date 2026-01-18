'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ExtractionResults, ConfirmedPositioning } from '@/types/database'
import { Loader2, CheckCircle } from 'lucide-react'

interface ConfirmationPanelProps {
  sessionId: string
  results?: ExtractionResults
  confirmed?: ConfirmedPositioning
}

export function ConfirmationPanel({ sessionId, results, confirmed }: ConfirmationPanelProps) {
  const [formData, setFormData] = useState({
    positioning_statement: confirmed?.positioning_statement || results?.positioning_statement || '',
    category: confirmed?.category || results?.category_claimed || '',
    primary_value_prop: confirmed?.primary_value_prop || results?.value_hierarchy?.[0]?.value_proposition || '',
    target_persona: confirmed?.target_persona || results?.primary_persona?.title || '',
    key_differentiator: confirmed?.key_differentiator || '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/extractions/${sessionId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setSaved(true)
      }
    } catch (err) {
      console.error('Failed to save confirmation:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Confirm Your Positioning</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Review and edit the extracted positioning. Save your confirmed version.
        </p>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="positioning">Positioning Statement</Label>
            <textarea
              id="positioning"
              className="w-full min-h-[80px] px-3 py-2 text-sm border rounded-md bg-background resize-none"
              value={formData.positioning_statement}
              onChange={(e) => handleChange('positioning_statement', e.target.value)}
              placeholder="We are [category] that helps [persona] achieve [outcome] through [differentiator]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="e.g., CRM software"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value_prop">Primary Value Proposition</Label>
            <Input
              id="value_prop"
              value={formData.primary_value_prop}
              onChange={(e) => handleChange('primary_value_prop', e.target.value)}
              placeholder="Your #1 value proposition"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="persona">Target Persona</Label>
            <Input
              id="persona"
              value={formData.target_persona}
              onChange={(e) => handleChange('target_persona', e.target.value)}
              placeholder="e.g., Sales Manager"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="differentiator">Key Differentiator</Label>
            <Input
              id="differentiator"
              value={formData.key_differentiator}
              onChange={(e) => handleChange('key_differentiator', e.target.value)}
              placeholder="What makes you different"
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            'Save Confirmed Positioning'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
