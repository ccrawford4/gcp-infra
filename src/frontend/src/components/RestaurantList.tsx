import React, { useEffect, useState } from 'react';
import {
    getRestaurants,
    Restaurant,
    addRestaurant,
    deleteRestaurant,
    RestaurantCreateInput,
    updateRestaurant,
} from '../api';
import { RestaurantForm, DeleteRestaurantDialog } from './RestaurantComponent';
import { Card, CardContent } from "@mui/material";
import { Button } from "@mui/material"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function RestaurantList() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {
        const data = await getRestaurants();
        setRestaurants(data);
    };

    const handleAddRestaurant = async (formData: RestaurantCreateInput) => {
        await addRestaurant(formData);
        setAddDialogOpen(false);
        await loadRestaurants();
    };

    const handleUpdateRestaurant = async (formData: { data: Omit<Restaurant, "ID">; ID: string }) => {
        await updateRestaurant(formData);
        setSelectedRestaurant(null);
        await loadRestaurants();
    };

    const handleDeleteRestaurant = async (id: string) => {
        console.log("Triggered!");
        const response = await deleteRestaurant(id);
        console.log(response);
        setDeleteDialogOpen(false);
        setSelectedRestaurant(null);
        await loadRestaurants();
    };

    useEffect(() => {
        console.log("selectedRestaurant: ", selectedRestaurant);
    }, [selectedRestaurant]);

    return (
        <div className="text-white p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-gray-300 text-3xl font-bold tracking-tight" style={{ color: "white" }}>Restaurants</h1>
                <Button style={{ color: "white" }} onClick={() => setAddDialogOpen(true)} className="gap-2">
                    <Plus size={16} />
                    Add Restaurant
                </Button>
            </div>

            <div className="grid gap-4">
                {restaurants.map((restaurant) => (
                    <Card key={restaurant.ID} className="transition-all hover:shadow-lg">
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                                <div className="text-sm text-muted-foreground space-x-2">
                                    <span>{restaurant.cuisine}</span>
                                    <span>•</span>
                                    <span>{restaurant.location}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outlined"
                                    size={"small"}
                                    className="gap-2"
                                    onClick={() => setSelectedRestaurant(restaurant)}
                                >
                                    <Edit size={14} />
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => {
                                        setSelectedRestaurant(restaurant);
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add Restaurant Dialog */}
            <Dialog open={addDialogOpen} onChange={() => setAddDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                        <DialogTitle>Add New Restaurant</DialogTitle>
                    <RestaurantForm
                        onClose={() => setAddDialogOpen(false)}
                        onSubmit={handleAddRestaurant}
                        mode="create"
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Restaurant Dialog */}
            <Dialog
                open={selectedRestaurant !== null && !deleteDialogOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogTitle>Edit Restaurant</DialogTitle>
                    {selectedRestaurant && (
                        <RestaurantForm
                            onClose={() => setSelectedRestaurant(null)}
                            onSubmit={(data) => handleUpdateRestaurant({ ID: selectedRestaurant.ID, data: data})}
                            mode="update"
                            restaurant={selectedRestaurant}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Restaurant Dialog */}
            {selectedRestaurant && (
                <DeleteRestaurantDialog
                    restaurant={selectedRestaurant}
                    onDelete={handleDeleteRestaurant}
                    open={deleteDialogOpen}
                    onClose={() => {
                        setDeleteDialogOpen(false);
                        setSelectedRestaurant(null);
                    }}
                />
            )}
        </div>
    );
}