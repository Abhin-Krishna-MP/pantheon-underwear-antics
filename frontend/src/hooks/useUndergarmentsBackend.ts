import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

import { API_BASE_URL } from '@/config/api';

export interface Undergarment {
  id: string;
  name: string;
  color: string;
  material: string;
  customWashes: number;
  accessories: string[];
  purchaseDate: string;
  washCount: number;
  retired: boolean;
  retiredDate?: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  unlockedAt: string;
}

export function useUndergarmentsBackend() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [undergarments, setUndergarments] = useState<Undergarment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's undergarments from backend when user logs in
  useEffect(() => {
    if (user) {
      fetchUndergarments();
    } else {
      setUndergarments([]);
      setLoading(false);
    }
  }, [user]);

  const fetchUndergarments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/undergarments/`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        // Transform backend data to match frontend format
        const transformedData = data.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
          color: item.color,
          material: item.material,
          customWashes: item.custom_washes,
          accessories: item.accessories || [],
          purchaseDate: item.purchase_date,
          washCount: item.wash_count,
          retired: item.retired,
          retiredDate: item.retired_date,
          achievements: item.achievements || []
        }));
        setUndergarments(transformedData);
      } else {
        console.error('Failed to fetch undergarments');
        toast({
          title: "Error",
          description: "Failed to load your undergarments",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to fetch undergarments:', error);
      toast({
        title: "Error",
        description: "Failed to load your undergarments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addUndergarment = async (undergarmentData: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to add undergarments",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/undergarments/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: undergarmentData.name,
          color: undergarmentData.color,
          material: undergarmentData.material,
          custom_washes: undergarmentData.customWashes,
          accessories: undergarmentData.accessories || [],
          purchase_date: undergarmentData.purchaseDate,
        }),
      });

      if (response.ok) {
        const newUndergarment = await response.json();
        // Transform and add to state
        const transformedItem = {
          id: newUndergarment.id.toString(),
          name: newUndergarment.name,
          color: newUndergarment.color,
          material: newUndergarment.material,
          customWashes: newUndergarment.custom_washes,
          accessories: newUndergarment.accessories || [],
          purchaseDate: newUndergarment.purchase_date,
          washCount: newUndergarment.wash_count,
          retired: newUndergarment.retired,
          retiredDate: newUndergarment.retired_date,
          achievements: newUndergarment.achievements || []
        };
        
        setUndergarments(prev => [transformedItem, ...prev]);
        toast({
          title: "Success",
          description: "Undergarment added successfully!",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to add undergarment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to add undergarment:', error);
      toast({
        title: "Error",
        description: "Failed to add undergarment",
        variant: "destructive",
      });
    }
  };

  const washUndergarment = async (id: string) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/undergarments/${id}/update/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'wash' }),
      });

      if (response.ok) {
        const updatedUndergarment = await response.json();
        // Update the undergarment in state
        setUndergarments(prev =>
          prev.map(ug => 
            ug.id === id 
              ? {
                  ...ug,
                  washCount: updatedUndergarment.wash_count,
                  achievements: updatedUndergarment.achievements || ug.achievements
                }
              : ug
          )
        );
        toast({
          title: "Washed!",
          description: "Your undergarment is now clean!",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to wash undergarment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to wash undergarment:', error);
      toast({
        title: "Error",
        description: "Failed to wash undergarment",
        variant: "destructive",
      });
    }
  };

  const retireUndergarment = async (id: string) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/undergarments/${id}/update/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'retire' }),
      });

      if (response.ok) {
        const updatedUndergarment = await response.json();
        // Update the undergarment in state
        setUndergarments(prev =>
          prev.map(ug => 
            ug.id === id 
              ? {
                  ...ug,
                  retired: updatedUndergarment.retired,
                  retiredDate: updatedUndergarment.retired_date
                }
              : ug
          )
        );
        toast({
          title: "Retired!",
          description: "Your undergarment has been retired with honor!",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to retire undergarment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to retire undergarment:', error);
      toast({
        title: "Error",
        description: "Failed to retire undergarment",
        variant: "destructive",
      });
    }
  };

  const deleteUndergarment = async (id: string) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/undergarments/${id}/delete/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setUndergarments(prev => prev.filter(ug => ug.id !== id));
        toast({
          title: "Deleted!",
          description: "Undergarment has been removed",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete undergarment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to delete undergarment:', error);
      toast({
        title: "Error",
        description: "Failed to delete undergarment",
        variant: "destructive",
      });
    }
  };

  return {
    underwear: undergarments,
    addUndergarment,
    washUndergarment,
    retireUndergarment,
    deleteUndergarment,
    loading,
    refreshData: fetchUndergarments,
  };
} 