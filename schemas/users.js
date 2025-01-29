import { z } from "zod";

// Define a schema for users.
const userSchema = z.object({
    username: z.string({ message: 'Username must be a string' })
        .min(3, { message: 'Username must be at least 3 characters long' }),
    email: z.string().email({ message: 'Invalid email address' })
        .min(5),
    password: z.string({ message: 'Password must be a string' })
        .min(6, { message: 'Password must be at least 6 characters long' }),
    role: z.enum(['user', 'admin'], { message: 'Role must be either "user" or "admin"' }),
});

// Function to validate a complete user object.
export function validateUser(input) {
    return userSchema.safeParse(input);
}

// Function to validate partial user updates.
export function validatePartialUser(input) {
    return userSchema.partial().safeParse(input);
}
