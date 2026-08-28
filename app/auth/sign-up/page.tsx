"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form";
import { z } from "zod"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase.config";
import { useState } from "react";
import Image from 'next/image'
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z.email('Please enter a valid email!').min(1, 'Please enter your email!'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string()
        .min(8, 'Password must be at least 8 characters'),
}).superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
        ctx.addIssue({ path: ["confirmPassword"], code: "custom", message: "Password doesn't match!" })
    }
})

const SignUp = () => {
    const provider = new GoogleAuthProvider();

    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
    const [authMethod, setAuthMethod] = useState<"email" | "gmail">('email');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const { email, password } = data;
        setAuthMethod('email');
        setIsAuthLoading(true);
        await createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                toast.success('Signed up successfully!');
                router.replace('/');
            })
            .catch((error) => {
                const errorMessage = error.message;
                toast.error(errorMessage || 'Something wen wrong! Please try again!');
            }).finally(() => {
                setIsAuthLoading(false);
            });
    }

    async function handleGoogleSignIn() {
        setAuthMethod('gmail');
        setIsAuthLoading(true);
        await signInWithPopup(auth, provider)
            .then(() => {
                toast.success('Signed up successfully!');
                router.replace('/');
            }).catch((error) => {
                const errorMessage = error.message;
                toast.error(errorMessage || 'Something wen wrong! Please try again!');
            }).finally(() => {
                setIsAuthLoading(false);
            });
    }

    return (
        <div className="flex flex-col gap-4">
            <h4 className="text-3xl font-bold">Create you account!</h4>
            <p className="text-base text-gray-500 -mt-2">Join us for your amazing crypto journey!</p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 md:min-w-100">
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Email</FieldLabel>
                            <Input
                                placeholder="Enter your email"
                                type="email"
                                {...field}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}

                />
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Password</FieldLabel>
                            <div className="relative">
                                <Input
                                    placeholder="Enter your password"
                                    type={showPassword ? "text" : "password"}
                                    className="pr-6"
                                    {...field}
                                />
                                <Button
                                    type="button"
                                    className="p-0! bg-transparent hover:bg-transparent cursor-pointer z-10 absolute top-0 right-3"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <EyeOff className="text-white" /> : <Eye className="text-white" />}
                                </Button>
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Confirm Password</FieldLabel>
                            <div className="relative">
                                <Input
                                    placeholder="Re-enter your password"
                                    type={showPassword ? "text" : "password"}
                                    className="pr-6"
                                    {...field}
                                />
                                <Button
                                    type="button"
                                    className="p-0! bg-transparent hover:bg-transparent cursor-pointer z-10 absolute top-0 right-3"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    {showConfirmPassword ? <EyeOff className="text-white" /> : <Eye className="text-white" />}
                                </Button>
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-500/90 cursor-pointer mt-1"
                    disabled={isAuthLoading}
                >
                    {(isAuthLoading && authMethod === 'email') ? 'Signing up...' : 'Sign up'}
                </Button>
            </form>
            <div className="flex items-center gap-3 relative my-2">
                <Separator />
                <p className="text-xl font-bold text-center absolute z-10 bg-dark-700 right-1/2 translate-x-1/2">OR</p>
            </div>
            <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isAuthLoading}
                className="cursor-pointer disabled:cursor-not-allowed"
            >
                {(isAuthLoading && authMethod === 'gmail') ? (
                    <Loader2Icon className="size-5 animate-spin" />
                ) : (
                    <>
                        <Image
                            src='/assets/google_logo.svg'
                            alt="google"
                            width={24}
                            height={24}
                        />
                        Sign up with Google
                    </>
                )}
            </Button>

            <div className="flex gap-2 mt-2">
                <p className="text-gray-400">
                    Already have an account?
                </p>
                <Link
                    href={'/auth/login'}
                    className="text-white font-semibold hover:underline cursor-pointer"
                >
                    Login
                </Link>
            </div>
        </div>
    )
}

export default SignUp;