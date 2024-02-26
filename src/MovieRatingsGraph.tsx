import { onMount, createSignal } from "solid-js";
import * as d3 from "d3";

interface Review {
    date: string;
    title: string;
    rating: string;
    rewatch: boolean;
    thumbnail: string;
    link: string;
}

interface MovieData {
    reviews: Review[];
    availableYears: number[];
}

interface MovieRatingsGraphProps {
    width: number;
    height: number;
}

const MovieRatingsGraph = (props: MovieRatingsGraphProps) => {
    let svgRef: SVGSVGElement | undefined;
    const [username, setUsername] = createSignal("zimonitrome");
    const [year, setYear] = createSignal(2023);
    const [data, setData] = createSignal<MovieData>({ reviews: [], availableYears: [] });
    const [isLoading, setIsLoading] = createSignal(true);

    const fetchData = async (username: string, year: number) => {
        setIsLoading(true); // Start loading
        const response = await fetch(`https://script.google.com/macros/s/AKfycbwiHxvPC5gLGLg1zBAjcxEbzKrBsANT129Nd4FM8Bh7xsuUPg9vtUhTokAz9qMbHoK7/exec?username=${username}&year=${year}`);
        const jsonData: MovieData = await response.json();
        setData(jsonData);
        setIsLoading(false); // End loading
    };

    const refetchData = () => {
        // You might want to validate username and year here
        fetchData(username(), year());
    };

    onMount(() => {
        fetchData(username(), year()).then(() => {
            const { width, height } = props;
            const svg = d3.select(svgRef!)
                .attr("width", width)
                .attr("height", height);

            const margin = { top: 20, right: 30, bottom: 30, left: 40 };
            const xScale = d3.scaleBand().range([margin.left, width - margin.right]).padding(0.1);
            const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

            const processedData = processData(data());
            // Calculate the max stack height
            const maxStackHeight = Math.max(...Object.values(processedData).map(d => d.length));
            // Adjust the yScale domain to account for the max stack height
            yScale.domain([0, maxStackHeight * 100]); // assuming each image is 100px high

            const ratings = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
            xScale.domain(ratings);

            // Append x-axis labels
            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(xScale).tickFormat(i => i).tickSizeOuter(0));

            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width / 2)
                .attr("y", height - 6)
                .text("Rating")
                .attr("font-family", "sans-serif")
                .attr("font-size", "16px");


            // Tooltip div for movie titles
            const tooltip = d3.select("body").append("div")
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("padding", "10px")
                .style("background", "white")
                .style("border", "1px solid #ccc")
                .style("border-radius", "5px")
                .style("text-align", "center")
                .style("font-size", "12px");

            ratings.forEach((rating) => {
                processedData[rating]?.reverse().forEach((movie, index) => {
                    // Calculate the y position from the bottom up
                    const yPos = height - margin.bottom - ((index + 1) * 100); // assuming each image is 100px high
                    svg.append("image")
                        .attr("href", movie.thumbnail)
                        .attr("x", xScale(rating))
                        .attr("y", yPos)
                        .attr("width", xScale.bandwidth())
                        .attr("height", 100) // Adjust based on your needs
                        .on("mouseover", (event) => {
                            tooltip.style("visibility", "visible").html(
                                `<b>${movie.title}</b>${movie.rewatch ? "(rewatch)" : ""}<br/>Rating: ${movie.rating}/10<br/>Date: ${movie.date}`);
                        })
                        .on("mousemove", (event) => {
                            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
                        })
                        .on("mouseout", () => {
                            tooltip.style("visibility", "hidden");
                        })
                        .on("click", () => window.open("https://letterboxd.com" + movie.link, "_blank")) // Open link on click
                        .style("cursor", "pointer"); // Set the cursor to pointer on hover
                    // yPos += 100; // Adjust y position for stacking
                });
            });
        });
    });

    const processData = (data: MovieData) => {
        const groupedByRating = data.reviews.reduce((acc: Record<string, Review[]>, curr: Review) => {
            const rating = curr.rating;
            if (!acc[rating]) {
                acc[rating] = [];
            }
            acc[rating].push(curr);
            return acc;
        }, {});

        return groupedByRating;
    };

    return (
        <>
            {isLoading() && <div style="text-align: center; padding: 20px;">Loading...</div>}
            <svg ref={svgRef} style={{ display: isLoading() ? 'none' : 'block' }}></svg>
            <div style={{display: "flex", gap: ".5em"}}>
                <input type="text" value={username()} onInput={(e) => setUsername(e.currentTarget.value)} />
                <input type="number" value={year()} onInput={(e) => setYear(e.currentTarget.value)} />
                <button onClick={refetchData}>Load Data</button>
            </div>
        </>
    );
};

export default MovieRatingsGraph;
