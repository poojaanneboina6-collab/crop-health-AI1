import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Sprout, Droplets, Thermometer, Wind, Beaker, MapPin, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Recommendations() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    ph: "",
    location: "",
    rainfall: ""
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/recommend", {
        ...data,
        N: Number(data.N),
        P: Number(data.P),
        K: Number(data.K),
        ph: Number(data.ph),
        rainfall: data.rainfall ? Number(data.rainfall) : undefined
      });
      return res.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Recommendation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">Smart Crop Recommendation</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get personalized crop suggestions based on your soil health and real-time weather data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 shadow-xl border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="w-5 h-5 text-primary" />
                Soil Details
              </CardTitle>
              <CardDescription>Enter your soil test results</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="N">Nitrogen (N)</Label>
                    <Input 
                      id="N" type="number" placeholder="e.g. 90" 
                      value={formData.N} onChange={e => setFormData({...formData, N: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="P">Phosphorus (P)</Label>
                    <Input 
                      id="P" type="number" placeholder="e.g. 42" 
                      value={formData.P} onChange={e => setFormData({...formData, P: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="K">Potassium (K)</Label>
                    <Input 
                      id="K" type="number" placeholder="e.g. 43" 
                      value={formData.K} onChange={e => setFormData({...formData, K: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ph">pH Level</Label>
                    <Input 
                      id="ph" type="number" step="0.1" placeholder="e.g. 6.5" 
                      value={formData.ph} onChange={e => setFormData({...formData, ph: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">District/State</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="location" className="pl-10" placeholder="e.g. Hyderabad, Telangana" 
                      value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rainfall">Annual Rainfall (mm) - Optional</Label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="rainfall" type="number" className="pl-10" placeholder="e.g. 1100" 
                      value={formData.rainfall} onChange={e => setFormData({...formData, rainfall: e.target.value})}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-bold" 
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Search className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sprout className="w-5 h-5 mr-2" />
                      Get Recommendations
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {mutation.data ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    Top Suggestions for Your Land
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mutation.data.recommendations.map((rec: any, idx: number) => (
                      <Card key={idx} className={`overflow-hidden border-l-4 ${idx === 0 ? 'border-l-green-500 bg-green-50/50' : 'border-l-blue-400'}`}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-foreground">{rec.crop}</h4>
                              <p className="text-sm font-medium text-muted-foreground">
                                Match Score: {(rec.confidence * 100).toFixed(1)}%
                              </p>
                            </div>
                            {idx === 0 && (
                              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">Best Match</span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs text-center">
                            <div className="p-2 bg-white/50 rounded-lg border border-border">
                              <div className="text-muted-foreground mb-1">Temp</div>
                              <div className="font-bold">{rec.ideal.temp}°C</div>
                            </div>
                            <div className="p-2 bg-white/50 rounded-lg border border-border">
                              <div className="text-muted-foreground mb-1">Humidity</div>
                              <div className="font-bold">{rec.ideal.hum}%</div>
                            </div>
                            <div className="p-2 bg-white/50 rounded-lg border border-border">
                              <div className="text-muted-foreground mb-1">Rainfall</div>
                              <div className="font-bold">{rec.ideal.rain}mm</div>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm font-semibold mb-2">Ideal Soil Profile:</p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 bg-primary/10 rounded-md text-[10px] font-bold">N: {rec.ideal.N}</span>
                              <span className="px-2 py-1 bg-primary/10 rounded-md text-[10px] font-bold">P: {rec.ideal.P}</span>
                              <span className="px-2 py-1 bg-primary/10 rounded-md text-[10px] font-bold">K: {rec.ideal.K}</span>
                              <span className="px-2 py-1 bg-primary/10 rounded-md text-[10px] font-bold">pH: {rec.ideal.ph}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border rounded-3xl bg-muted/30">
                  <Sprout className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground">Ready for analysis</h3>
                  <p className="text-muted-foreground max-w-sm mt-2">
                    Enter your soil data to see which crops will flourish in your specific conditions.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
