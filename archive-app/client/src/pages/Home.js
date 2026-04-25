import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function ImageSlider({ images = [], title, onZoom }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <img
        src="https://placehold.co/800x500?text=No+Image"
        alt="No object"
      />
    );
  }

  const previous = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex(index === 0 ? images.length - 1 : index - 1);
  };

  const next = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex(index === images.length - 1 ? 0 : index + 1);
  };

  return (
    <div className="image-slider">
      <img
        src={images[index]}
        alt={`${title} ${index + 1}`}
        onClick={() => onZoom(images[index])}
        onError={(e) => {
          e.currentTarget.src =
            "https://placehold.co/800x500?text=Image+Unavailable";
        }}
      />

      {images.length > 1 && (
        <>
          <button className="slider-btn prev" onClick={previous}>
            ‹
          </button>

          <button className="slider-btn next" onClick={next}>
            ›
          </button>

          <div className="slider-dots">
            {images.map((_, dotIndex) => (
              <button
                key={dotIndex}
                className={dotIndex === index ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIndex(dotIndex);
                }}
                aria-label={`Go to image ${dotIndex + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Home({ objects = [], setObjects, searchTerm = "", user }) {
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [zoomImage, setZoomImage] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  const collections = ["All", "Material", "Furniture", "Fixture", "Article"];

  const filteredObjects = objects.filter((item) => {
    const search = searchTerm.toLowerCase();
    const itemCollection = item.collectionType || "Material";

    const matchesSearch =
      item.title?.toLowerCase().includes(search) ||
      item.category?.toLowerCase().includes(search) ||
      itemCollection.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search);

    const matchesCollection =
      selectedCollection === "All" || itemCollection === selectedCollection;

    return matchesSearch && matchesCollection;
  });

  const handleShare = async (id) => {
    const url = `${window.location.origin}/edit/${id}`;

    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch {
      alert(url);
    }
  };

  const handleCommentSubmit = async (e, id) => {
    e.preventDefault();

    const text = commentInputs[id];

    if (!text || text.trim().length < 2) return;

    try {
      const res = await api.post(`/objects/${id}/comments`, {
        text,
        author: user?.username 
      });

      setObjects(
        objects.map((item) => (item._id === id ? res.data.object : item))
      );

      setCommentInputs({
        ...commentInputs,
        [id]: ""
      });
    } catch (err) {
      alert(err.response?.data?.message || "Could not add comment.");
    }
  };

  return (
    <div>
      <main className="container">
        <section className="featured-collection">
          <div className="featured-line"></div>

          <h2>FEATURED COLLECTION</h2>

          <p>
            A curated selection of archival objects highlighting design, culture,
            and history.
          </p>

          <button onClick={() => setSelectedCollection("All")}>
            Explore Collection
          </button>
        </section>

        <section className="platform-stats">
          <div>
            <strong>{objects.length}</strong>
            <span>Total Objects</span>
          </div>

          <div>
            <strong>{collections.length - 1}</strong>
            <span>Collections</span>
          </div>

          <div>
            <strong>2026</strong>
            <span>Archive Year</span>
          </div>
        </section>

        <section className="objects-header">
          <div>
            <p className="eyebrow">Browse Collection</p>
            <h2>Archive Objects</h2>
          </div>

          <div className="header-actions">
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
            >
              {collections.map((collection) => (
                <option key={collection} value={collection}>
                  {collection === "All" ? "All Collections" : collection}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="collection-tabs">
          {collections.map((collection) => (
            <button
              key={collection}
              className={selectedCollection === collection ? "active" : ""}
              onClick={() => setSelectedCollection(collection)}
            >
              {collection === "All" ? "All" : `${collection}s`}
            </button>
          ))}
        </section>

        <section className="object-grid">
          {filteredObjects.length === 0 ? (
            <div className="empty-message">
              No objects found. Add your first object to the archive.
            </div>
          ) : (
            filteredObjects.map((item) => {
              const itemCollection = item.collectionType || "Material";

              const imageList =
                item.images && item.images.length > 0
                  ? item.images
                  : item.imageUrl
                  ? [item.imageUrl]
                  : [];

              return (
                <article className="object-card" key={item._id}>
                  <div className="object-image">
                    <ImageSlider
                      images={imageList}
                      title={item.title}
                      onZoom={setZoomImage}
                    />
                  </div>

                  <div className="object-meta">
                    <div className="category">
                      {itemCollection} / {item.category}
                    </div>

                    <h3>{item.title}</h3>

                    <div className="date">{item.year || item.date}</div>

                    <p className="desc">{item.description}</p>

                    <div className="card-actions">
                      <Link to={`/edit/${item._id}`} className="action-link">
                        Edit
                      </Link>

                      <button
                        className="action-link"
                        onClick={() => handleShare(item._id)}
                      >
                        Share
                      </button>
                    </div>

                    <div className="comment-section">
                      <h4>Comments</h4>

                      {item.comments && item.comments.length > 0 ? (
                        item.comments.map((comment, index) => (
                          <p className="comment" key={index}>
                            <strong>{comment.author || "Anonymous"}:</strong>{" "}
                            {comment.text}
                          </p>
                        ))
                      ) : (
                        <p className="comment empty">No comments yet.</p>
                      )}

                      <form onSubmit={(e) => handleCommentSubmit(e, item._id)}>
                        <input
                          placeholder="Add a comment..."
                          value={commentInputs[item._id] || ""}
                          onChange={(e) =>
                            setCommentInputs({
                              ...commentInputs,
                              [item._id]: e.target.value
                            })
                          }
                        />
                        <button type="submit">Post</button>
                      </form>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>

      {zoomImage && (
        <div className="zoom-overlay" onClick={() => setZoomImage(null)}>
          <img src={zoomImage} alt="Zoomed object" className="zoom-image" />
        </div>
      )}
    </div>
  );
}

export default Home;