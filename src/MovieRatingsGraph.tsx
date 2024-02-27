import { createSignal, Show, For, createEffect } from "solid-js";
import { Review, isLoading, setIsLoading } from "./App";

const MovieRatingsGraph = (props: { reviews: Review[] }) => {

    // Determine the number of columns based on the longest row
    const ratings = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

    setIsLoading(false);

    return (
        <div style={{
            display: "flex",
            "flex-direction": "column",
            width: "100%", // Ensures the container takes up the full width of its parent
            gap: ".1em",
        }}>
            <Show when={!isLoading()} fallback={<div>Loading...</div>}>
                <Show when={props.reviews.length !== 0}>
                    <For each={ratings.reverse()}>
                        {(rating) => {
                            const longestRowLength = Math.max(...ratings.map(rating =>
                                props.reviews.filter(review => review.rating === rating).length
                            )) + 1;
                            const imageWidthPercent = 100 / longestRowLength
                            console.log(longestRowLength, imageWidthPercent);
                            return <div style={{
                                display: "grid",
                                "grid-template-columns": `repeat(${longestRowLength}, 1fr)`,
                            }}>
                                <div style={{
                                    width: `${15*imageWidthPercent}%`,
                                    "aspect-ratio": "70 / 105",
                                    display: "flex",
                                    "justify-content": "end", /* Align horizontal */
                                    "align-items": "center", /* Align vertical */
                                    "border-right": "3px solid white",
                                }}>
                                    {rating} -
                                </div>
                                <For each={props.reviews.filter(r => r.rating === rating).reverse()}>
                                    {(review) => (
                                        <a href={"https://letterboxd.com" + review.link} style={{ display: "inline-block", "line-height": 0 }} >
                                            <img
                                                src={review.thumbnail}
                                                alt={review.title}
                                                title={review.title}
                                                style={{
                                                    width: `${15*imageWidthPercent}%`, // Adjust based on the percentage
                                                    height: "auto", // Maintain aspect ratio
                                                }}
                                            />
                                        </a>
                                    )}
                                </For>
                            </div>
                        }}
                    </For>
                </Show>
            </Show>
        </div>
    );
    
};

export default MovieRatingsGraph;
