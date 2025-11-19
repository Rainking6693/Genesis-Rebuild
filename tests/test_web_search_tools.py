from infrastructure.deepeyes.web_search_tools import image_search, video_search, search_web


def test_web_search_outputs():
    results = search_web("test query")
    assert len(results["links"]) == 3
    assert len(results["images"]) == 2
    assert len(results["videos"]) == 2


def test_image_video_search():
    img = image_search("diagram")
    vid = video_search("toolchain")
    assert len(img) == 3
    assert len(vid) == 2
