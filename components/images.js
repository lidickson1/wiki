"use client";

import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper";
// import YouTube from "react-youtube";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/autoplay";

export function Images({ images }) {
    const [index, setIndex] = useState(0);
    const [modal, setModal] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    return (
        <>
            <figure style={{ margin: "15px" }}>
                <Carousel
                    autoPlay={!modal}
                    interval={5000}
                    infiniteLoop={true}
                    showThumbs={false}
                    showStatus={false}
                    showIndicators={images.length > 1}
                    onChange={(i) => setIndex(i)}
                    onClickItem={() => {
                        setModal(!modal);
                        setModalIndex(index);
                    }}
                >
                    {images.map((media, i) => (
                        <div key={i} className="media-div" style={{ cursor: "pointer" }}>
                            {<Media media={media} />}
                        </div>
                    ))}
                </Carousel>
                {/* <Swiper
                    navigation
                    centeredSlides
                    loop
                    modules={[Navigation, Pagination, Autoplay]}
                    pagination={{
                        clickable: true,
                    }}
                    slidesPerView="auto"
                    autoplay={{
                        delay: 5000,
                        pauseOnMouseEnter: true,
                    }}
                >
                    {images.map((media, i) => (
                        <SwiperSlide key={i}>
                            {<Media media={media} />}
                        </SwiperSlide>
                    ))}
                </Swiper> */}
                <div style={{ position: "relative", marginTop: "5px" }}>
                    <figcaption style={{ position: "absolute" }}>
                        {images[index].caption}
                    </figcaption>
                    {/*get the longest caption and use it to fix the height of the caption*/}
                    <figcaption style={{ visibility: "hidden" }}>
                        {
                            images.find(
                                (image) =>
                                    image.caption.length ===
                                    Math.max(...images.map((image) => image.caption.length))
                            ).caption
                        }
                    </figcaption>
                </div>
            </figure>
            <div className={`modal ${modal && "is-active"}`} onClick={() => setModal(false)}>
                <div className="modal-background"></div>
                <div
                    className="modal-content"
                    style={{
                        textAlign: "center",
                        width: "auto",
                        maxHeight: "80vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {modal && <Media media={images[modalIndex]} modal />}
                    <figcaption className="mt-2">{images[modalIndex].caption}</figcaption>
                </div>
                {/* <button
        className="modal-close is-large"
        aria-label="close"
    ></button> */}
            </div>
        </>
    );
}

export function InlineImages({ images, floatIndex }) {
    return (
        <div
            className="inline-images"
            style={{
                float: floatIndex % 2 == 0 ? "right" : "left",
                clear: floatIndex % 2 == 0 ? "right" : "left", //to prevent images on the same side overlapping
            }}
        >
            <Images images={images}></Images>
        </div>
    );
}

export function Media({ media, modal }) {
    // if (media.youtube) {
    //     return (
    //         <YouTube
    //             videoId={media.youtube}
    //             opts={{
    //                 playerVars: {
    //                     // https://developers.google.com/youtube/player_parameters
    //                     autoplay: 1,
    //                     playlist: media.youtube,
    //                     loop: 1,
    //                     mute: 1,
    //                 },
    //             }}
    //             // onReady={this._onReady}
    //         />
    //     );
    // } else
    if (media.video) {
        return (
            <video
                autoPlay
                muted={!modal}
                loop
                style={{ height: modal && "100%" }}
                playsInline //https://stackoverflow.com/a/67370259/11245570
                // onCanPlay={(e) => {
                //     e.target.muted = true;
                // }}
            >
                <source src={`/videos/${media.video}`} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    } else {
        return (
            <Image
                src={media.image}
                alt=""
                width="0"
                height="0"
                sizes="100vw"
                // fill
                // style={{ objectFit: "contain" }}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                }}
            />
        );
    }
}
