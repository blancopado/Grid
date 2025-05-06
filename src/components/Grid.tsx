import { useEffect, useState } from "react";

type Pixel = {
	id: string;
	r: number;
	g: number;
	b: number;
};

type GridProps = {
	rows: number;
	cols: number;
	backgroundColor: string;
	strokeColor: string;
};

function Grid({ rows, cols, backgroundColor, strokeColor }: GridProps) {
	const [pixels, setPixels] = useState<Pixel[][]>(
		Array.from({ length: rows }, () =>
			Array.from({ length: cols }, () => ({
				r: 0,
				g: 0,
				b: 0,
				id: crypto.randomUUID(),
			})),
		),
	);

	useEffect(() => {
		let timeoutId: number;
		let isMounted = true;

		const animate = () => {
			if (!isMounted) return;
			const time = Date.now();
			setPixels((prevPixels) =>
				prevPixels.map((row, rowIndex) =>
					row.map((pixel, colIndex) => {
						const dx = colIndex - cols / 2 + 0.5;
						const dy = rowIndex - rows / 2 + 0.5;
						const radius = Math.sqrt(dx * dx + dy * dy + 10000);

						const r = (Math.sin(radius + time / 2000) + 1) / 2;
						const g = (Math.sin(radius + time / 4000) + 1) / 2;
						const b = (Math.sin(radius + time / 6000) + 1) / 2;

						return { r, g, b, id: pixel.id };
					}),
				),
			);
			timeoutId = window.setTimeout(animate, 100);
		};

		animate();

		return () => {
			isMounted = false;
			clearTimeout(timeoutId);
		};
	}, [cols, rows]);

	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			viewBox={`0 0 ${cols * 10} ${rows * 10}`}
			style={{ width: "100%", maxWidth: "100%" }}
		>
			<defs>
				<pattern
					id="cellPattern"
					width="10"
					height="10"
					patternUnits="userSpaceOnUse"
				>
					<rect
						x="0"
						y="0"
						width="10"
						height="10"
						fill={backgroundColor}
						stroke={strokeColor}
						strokeWidth="0.5"
					/>
				</pattern>
			</defs>

			<rect
				x="0"
				y="0"
				width={rows * 10}
				height={rows * 10}
				fill="url(#cellPattern)"
			/>

			{pixels.map((row, rowIndex) =>
				row.map((pixel, colIndex) => {
					const x = colIndex * 10;
					const y = rowIndex * 10;

					const glowOpacity = (value: number) =>
						value > 0.005 ? 0.4 + value * 0.6 : 0;

					const max = Math.max(pixel.r, pixel.g, pixel.b);
					const color = `rgb(${Math.floor(pixel.r * 255)}, ${Math.floor(
						pixel.g * 255,
					)}, ${Math.floor(pixel.b * 255)})`;

					return (
						<g key={pixel.id} transform={`translate(${x + 5}, ${y + 5})`}>
							<ellipse
								cx="0"
								cy="0"
								rx="4"
								ry="4"
								fill={color}
								opacity={glowOpacity(max)}
							/>
							{/* 
							<ellipse cx="-1.5" cy="0" rx="0.7" ry="0.7" fill="red" />
							<ellipse cx="1" cy="1.8" rx="0.7" ry="0.7" fill="green" />
							<ellipse cx="1" cy="-1.8" rx="0.7" ry="0.7" fill="blue" /> */}
						</g>
					);
				}),
			)}
		</svg>
	);
}

export default Grid;
