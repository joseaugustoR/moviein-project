import { Button } from 'components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'components/ui/dropdown-menu';
import { useTheme } from 'components/ui/theme-provider';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import moviein from '../../../assets/moviein.png';
import movieinDark from '../../../assets/moviein-dark.png';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { IoMdColorPalette } from 'react-icons/io';
import { Sheet, SheetContent, SheetTrigger } from 'components/ui/sheet';
import { HiMenu } from "react-icons/hi";

const Navbar: React.FC = () => {
    const nav = useNavigate();
    const { theme, setTheme } = useTheme();

    return (
        <>
            <nav className="hidden md:flex fixed top-0 left-0 bg-background/50 border-b-[1px] backdrop-blur-sm border-b-gray-400/50 w-full h-[68px] z-[100] justify-between items-center">
                <div className='container flex justify-between'>
                    {
                        (theme === "dark" || theme === "system") && <img alt='Moviein' src={movieinDark} className="w-[100px] object-contain -dark:hidden" />
                    }
                    {
                        theme === "light" && <img alt='Moviein' src={moviein} className="w-[100px] object-contain -dark:hidden" />
                    }
                    <div className="flex gap-2">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {theme === "dark" && <MdDarkMode />}
                                    {theme === "light" && <MdLightMode />}
                                    {theme === "system" && <IoMdColorPalette />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setTheme("light")}><MdLightMode />Claro</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}><MdDarkMode />Escuro</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}><IoMdColorPalette />System</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="red" onClick={() => nav("/registro")}>Cadastre-se</Button>
                        <Button onClick={() => nav("/login")}>Entrar</Button>
                    </div>
                </div>
            </nav>
            <div className='flex md:hidden'>
                <Sheet >
                    <SheetTrigger asChild>
                        <Button className='fixed bottom-5 right-5 z-[9] w-[80px] h-[80px] rounded-full'>
                            <HiMenu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className='gap-4 flex flex-col justify-end pb-[120px]'>
                        {
                            (theme === "dark" || theme === "system") && <img alt='Moviein' src={movieinDark} className="w-[100px] object-contain -dark:hidden" />
                        }
                        {
                            theme === "light" && <img alt='Moviein' src={moviein} className="w-[100px] object-contain -dark:hidden" />
                        }

                        <Button variant="red" onClick={() => nav("/registro")}>Cadastre-se</Button>
                        <Button onClick={() => nav("/login")}>Entrar</Button>

                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className='w-full'>
                                    {theme === "dark" && <MdDarkMode />}
                                    {theme === "light" && <MdLightMode />}
                                    {theme === "system" && <IoMdColorPalette />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setTheme("light")}><MdLightMode />Claro</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}><MdDarkMode />Escuro</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}><IoMdColorPalette />System</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}

export default Navbar;