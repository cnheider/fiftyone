"""
Sample collections tests.

| Copyright 2017-2021, Voxel51, Inc.
| `voxel51.com <https://voxel51.com/>`_
|
"""
import random
import unittest

import fiftyone as fo
import fiftyone.zoo as foz
from fiftyone import ViewField as F


_ANIMALS = [
    "bear",
    "bird",
    "cat",
    "cow",
    "dog",
    "elephant",
    "giraffe",
    "horse",
    "sheep",
    "zebra",
]


def test_set_values():
    dataset = foz.load_zoo_dataset("quickstart").clone()

    with fo.ProgressBar() as pb:
        for sample in pb(dataset):
            sample["animal"] = fo.Classification(label=random.choice(_ANIMALS))
            sample.save()

    # Test simple fields

    path = "animal.label"
    path_upper = path + "_upper"
    path_check = path + "_check"

    values = dataset.values(path)
    print(dataset.count_values(path))

    values_upper = _to_upper(values)

    dataset.set_values(path_upper, values_upper)
    print(dataset.count_values(path_upper))

    view = dataset.set_field(
        path_check, F("label").upper() == F("label_upper")
    )
    print(view.count_values(path_check))

    # Test array fields

    path = "predictions.detections.label"
    path_upper = path + "_upper"
    path_check = path + "_check"

    values = dataset.values(path)
    print(dataset.count_values(path))

    values_upper = _to_upper(values)

    dataset.set_values(path_upper, values_upper)
    print(dataset.count_values(path_upper))

    view = dataset.set_field(
        path_check, F("label").upper() == F("label_upper")
    )
    print(view.count_values(path_check))


def test_set_values_frames():
    dataset = foz.load_zoo_dataset("quickstart-video").clone()

    with fo.ProgressBar() as pb:
        for sample in pb(dataset):
            for frame in sample.frames.values():
                frame["animal"] = fo.Classification(
                    label=random.choice(_ANIMALS)
                )

            sample.save()

    # Test simple fields

    path = "frames.animal.label"
    path_upper = path + "_upper"
    path_check = path + "_check"

    values = dataset.values(path)
    print(dataset.count_values(path))

    values_upper = _to_upper(values)

    dataset.set_values(path_upper, values_upper)
    print(dataset.count_values(path_upper))

    view = dataset.set_field(
        path_check, F("label").upper() == F("label_upper")
    )
    print(view.count_values(path_check))

    # Test array fields

    path = "frames.ground_truth_detections.detections.label"
    path_upper = path + "_upper"
    path_check = path + "_check"

    values = dataset.values(path)
    print(dataset.count_values(path))

    values_upper = _to_upper(values)

    dataset.set_values(path_upper, values_upper)
    print(dataset.count_values(path_upper))

    view = dataset.set_field(
        path_check, F("label").upper() == F("label_upper")
    )
    print(view.count_values(path_check))


def test_tag_classification():
    dataset = foz.load_zoo_dataset("imagenet-sample").clone()

    view = dataset.take(100)

    view.tag_objects("test", "ground_truth")
    print(dataset.count_values("ground_truth.tags"))

    view.untag_objects("test", "ground_truth")
    print(dataset.count_values("ground_truth.tags"))


def test_tag_detections():
    dataset = foz.load_zoo_dataset("quickstart").clone()

    view = dataset.filter_labels("predictions", F("confidence") > 0.99)

    print(dataset.count("predictions.detections"))
    print(view.count("predictions.detections"))
    print(dataset.count_values("predictions.detections.tags"))

    view.tag_objects("test", "predictions")
    print(dataset.count_values("predictions.detections.tags"))

    view.untag_objects("test", "predictions")
    print(dataset.count_values("predictions.detections.tags"))


def test_tag_detections_frames():
    dataset = foz.load_zoo_dataset("quickstart-video").clone()
    dataset.rename_frame_field("ground_truth_detections", "predictions")

    view = dataset.filter_labels("frames.predictions", F("index") == 1)

    print(dataset.count("frames.predictions.detections"))
    print(view.count("frames.predictions.detections"))
    print(dataset.count_values("frames.predictions.detections.tags"))

    view.tag_objects("test", "frames.predictions")
    print(dataset.count("frames.predictions.detections"))
    print(dataset.count_values("frames.predictions.detections.tags"))

    view.untag_objects("test", "frames.predictions")
    print(dataset.count("frames.predictions.detections"))
    print(dataset.count_values("frames.predictions.detections.tags"))


def _to_upper(values):
    if isinstance(values, list):
        return [_to_upper(v) for v in values]

    return values.upper()


if __name__ == "__main__":
    fo.config.show_progress_bars = True
    unittest.main(verbosity=2)
