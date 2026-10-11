import { Hero } from "@/components/hero/hero";
import { LogoCloud } from "@/components/logo-cloud/logo-cloud";
import { Navbar } from "@/components/navbar/navbar";

export default function Home() {
	return (
		<>
			<Navbar />
			<main>
				<Hero />
				<LogoCloud />
			</main>
		</>
	);
}
