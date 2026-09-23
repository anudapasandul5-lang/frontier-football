"""Build a Frontier 4 x 4 Series trophy from the supplied photo references.

Run with:
  blender --background --python scripts/build-frontier-trophy.py

Writes the editable source and web-ready GLB under public/objects, plus a
studio PNG preview. The site copy uses Meshopt-compressed geometry and embeds
the official Frontier crest texture.
"""

from __future__ import annotations

import math
import os

import bpy
from mathutils import Vector


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "public", "objects")
os.makedirs(OUT, exist_ok=True)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.curves, bpy.data.meshes, bpy.data.cameras, bpy.data.lights):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)


def material(name, color, metallic=0.0, roughness=0.4, coat=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if "Coat Weight" in bsdf.inputs:
        bsdf.inputs["Coat Weight"].default_value = coat
        bsdf.inputs["Coat Roughness"].default_value = 0.2
    return mat


GOLD = material("01 | Warm championship gold", (0.72, 0.40, 0.075), 0.94, 0.2, 0.04)
BRIGHT_GOLD = material("02 | Polished gold edges", (0.95, 0.68, 0.20), 0.98, 0.15, 0.025)
SHADOW_GOLD = material("03 | Recessed bronze", (0.20, 0.095, 0.018), 0.88, 0.29)
BLACK = material("04 | Lacquered black plinth", (0.012, 0.018, 0.026), 0.18, 0.22, 0.42)
PLAQUE = material("05 | Plaque enamel", (0.12, 0.075, 0.027), 0.24, 0.28, 0.26)
CREAM = material("06 | Engraving", (0.94, 0.78, 0.42), 0.72, 0.28)
TASSEL_RED = material("07 | Woven tassel red", (0.58, 0.018, 0.045), 0.0, 0.58)
TASSEL_GREEN = material("08 | Woven tassel green", (0.018, 0.24, 0.075), 0.0, 0.58)
TASSEL_YELLOW = material("09 | Woven tassel yellow", (0.78, 0.39, 0.035), 0.0, 0.58)
for fabric in (TASSEL_RED, TASSEL_GREEN, TASSEL_YELLOW):
    bsdf = fabric.node_tree.nodes.get("Principled BSDF")
    if "Sheen Weight" in bsdf.inputs:
        bsdf.inputs["Sheen Weight"].default_value = 0.32
        bsdf.inputs["Sheen Roughness"].default_value = 0.55
FLOOR = material("Studio | Deep charcoal", (0.025, 0.033, 0.045), 0.12, 0.52)


def assign(obj, mat):
    obj.data.materials.append(mat)
    return obj


def bevel(obj, width=0.04, segments=3):
    mod = obj.modifiers.new("Soft manufactured edges", "BEVEL")
    mod.width = width
    mod.segments = segments
    obj.modifiers.new("Weighted corner normals", "WEIGHTED_NORMAL")
    return obj


def cube(name, location, dimensions, mat, edge=0.035):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    assign(obj, mat)
    if edge:
        bevel(obj, edge)
    return obj


def lathe(name, profile, mat, flutes=0, amplitude=0.0, segments=192):
    verts, faces = [], []
    for i, (radius, z) in enumerate(profile):
        for j in range(segments):
            angle = 2 * math.pi * j / segments
            envelope = math.sin(math.pi * i / max(1, len(profile) - 1)) ** 0.65
            r = radius + (amplitude * envelope * math.cos(flutes * angle) if flutes else 0)
            verts.append((r * math.cos(angle), r * math.sin(angle), z))
    for i in range(len(profile) - 1):
        for j in range(segments):
            a = i * segments + j
            b = i * segments + (j + 1) % segments
            faces.append((a, b, b + segments, a + segments))
    mesh = bpy.data.meshes.new(name + " | precision turned mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.materials.append(mat)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    for poly in mesh.polygons:
        poly.use_smooth = True
    return obj


def torus(name, major, minor, z, mat, x=0, y=0, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor,
                                     major_segments=96, minor_segments=16,
                                     location=(x, y, z), rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    assign(obj, mat)
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj


def curve(name, points, radius, mat, resolution=24):
    data = bpy.data.curves.new(name + " | swept tube", "CURVE")
    data.dimensions = "3D"
    data.resolution_u = resolution
    data.bevel_depth = radius
    data.bevel_resolution = 5
    spline = data.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for bp, co in zip(spline.bezier_points, points):
        bp.co = co
        bp.handle_left_type = "AUTO"
        bp.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    assign(obj, mat)
    return obj


def text_mesh(name, body, size, location, mat, align="CENTER"):
    data = bpy.data.curves.new(name + " | lettering", "FONT")
    data.body = body
    data.align_x = align
    data.align_y = "CENTER"
    data.size = size
    data.extrude = 0.0018
    data.bevel_depth = 0.0008
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler[0] = math.radians(90)  # Front face points toward -Y.
    assign(obj, mat)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj = bpy.context.object
    obj.name = name
    return obj


def image_material(name, image_path):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (0.95, 0.9, 0.7, 1)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    texture = nodes.new("ShaderNodeTexImage")
    texture.image = bpy.data.images.load(image_path, check_existing=True)
    texture.image.colorspace_settings.name = "sRGB"
    texture.image.pack()
    mat.node_tree.links.new(texture.outputs["Color"], shader.inputs["Base Color"])
    mat.node_tree.links.new(texture.outputs["Alpha"], shader.inputs["Alpha"])
    mat.node_tree.links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    return mat


def crest_decal():
    # The official Frontier crest already used in the site navigation.
    cx, y, cz = -0.47, -0.558, 0.59
    width, height = 0.235, 0.287
    vertices = [(cx - width / 2, y, cz - height / 2),
                (cx + width / 2, y, cz - height / 2),
                (cx + width / 2, y, cz + height / 2),
                (cx - width / 2, y, cz + height / 2)]
    mesh = bpy.data.meshes.new("Nameplate | Frontier crest decal mesh")
    mesh.from_pydata(vertices, [], [(0, 1, 2, 3)])
    uv = mesh.uv_layers.new(name="UVMap")
    for loop_index, coords in zip(mesh.polygons[0].loop_indices,
                                  ((0, 0), (1, 0), (1, 1), (0, 1))):
        uv.data[loop_index].uv = coords
    obj = bpy.data.objects.new("Nameplate | official Frontier crest", mesh)
    bpy.context.collection.objects.link(obj)
    assign(obj, image_material("10 | Official Frontier crest", os.path.join(ROOT, "public", "crest.webp")))
    return obj


def tassel_fringe(name, center, length, sway, mat, strands=14):
    """Make a low-poly yarn bundle from individually tapered swept fibers."""
    verts, faces = [], []
    sides, rings = 5, 6
    cx, cy, top = center
    for strand in range(strands):
        angle = 2 * math.pi * strand / strands
        spread_x = math.cos(angle)
        spread_y = math.sin(angle)
        end_offset = ((strand % 3) - 1) * 0.008
        base = len(verts)
        for ring in range(rings):
            t = ring / (rings - 1)
            radial = 0.014 + 0.04 * t
            x = cx + spread_x * radial + sway * math.sin(t * math.pi / 2) + end_offset * t
            y = cy + spread_y * radial
            z = top - length * t + 0.012 * math.sin(t * math.pi) * spread_y
            radius = 0.008 * (1 - 0.78 * t)
            for side in range(sides):
                a = 2 * math.pi * side / sides
                verts.append((x + radius * math.cos(a), y + radius * math.sin(a), z))
        for ring in range(rings - 1):
            for side in range(sides):
                a = base + ring * sides + side
                b = base + ring * sides + (side + 1) % sides
                faces.append((a, b, b + sides, a + sides))
    mesh = bpy.data.meshes.new(name + " | individual yarn fibers")
    mesh.from_pydata(verts, [], faces)
    mesh.materials.append(mat)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    for poly in mesh.polygons:
        poly.use_smooth = True
    return obj


def ribbon_tail(name, side, anchor_x, top_z, end_z, sway, width, mat, y):
    """Broad, gently rippled silk ribbon with a soft fringe at its end."""
    across, down = 8, 24
    verts, faces, uv_coords = [], [], []
    for row in range(down + 1):
        t = row / down
        center_x = side * (anchor_x + 0.075 + sway * t + 0.045 * math.sin(t * math.pi))
        z = top_z + (end_z - top_z) * t
        for col in range(across + 1):
            u = col / across
            lateral = (u - 0.5) * width
            wave = 0.012 * math.sin(t * math.pi * 5 + u * math.pi * 2)
            x = center_x + side * lateral
            yy = y + wave + 0.006 * math.cos(u * math.pi * 2)
            zz = z + 0.009 * math.sin(u * math.pi * 2 + t * 5)
            verts.append((x, yy, zz))
            uv_coords.append((u, 1.0 - t))
    for row in range(down):
        for col in range(across):
            a = row * (across + 1) + col
            b = a + 1
            c = b + across + 1
            d = a + across + 1
            faces.append((d, c, b, a) if side > 0 else (a, b, c, d))
    mesh = bpy.data.meshes.new(name + " | rippled woven cloth")
    mesh.from_pydata(verts, [], faces)
    mesh.materials.append(mat)
    mesh.update()
    uv = mesh.uv_layers.new(name="Ribbon weave UV")
    for polygon in mesh.polygons:
        polygon.use_smooth = True
        for loop_index in polygon.loop_indices:
            uv.data[loop_index].uv = uv_coords[mesh.loops[loop_index].vertex_index]
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    solidify = obj.modifiers.new("Fine silk thickness", "SOLIDIFY")
    solidify.thickness = 0.008
    solidify.offset = 0
    edge = obj.modifiers.new("Soft ribbon edges", "BEVEL")
    edge.width = 0.004
    edge.segments = 2
    return obj


def ribbon_fringe(name, side, center_x, y, end_z, width, mat, strands=25):
    """Fine, separated yarns hang below each broad fabric ribbon."""
    verts, faces = [], []
    sides, rings = 4, 5
    for strand in range(strands):
        u = strand / (strands - 1) - 0.5
        x0 = center_x + side * u * width * 0.94
        length = 0.12 + 0.045 * (0.5 + 0.5 * math.sin(strand * 2.17))
        base = len(verts)
        for ring in range(rings):
            t = ring / (rings - 1)
            x = x0 + side * (0.012 * math.sin(t * math.pi * 1.4 + strand) + 0.02 * u * t)
            yy = y - 0.003 * math.sin(t * math.pi + strand)
            z = end_z - length * t
            radius = 0.0038 * (1 - 0.75 * t)
            for edge in range(sides):
                a = 2 * math.pi * edge / sides
                verts.append((x + radius * math.cos(a), yy + radius * math.sin(a), z))
        for ring in range(rings - 1):
            for edge in range(sides):
                a = base + ring * sides + edge
                b = base + ring * sides + (edge + 1) % sides
                faces.append((a, b, b + sides, a + sides))
    mesh = bpy.data.meshes.new(name + " | separate fringe fibers")
    mesh.from_pydata(verts, [], faces)
    mesh.materials.append(mat)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    for poly in mesh.polygons:
        poly.use_smooth = True
    return obj


def handle_tassel(side, label, color, mat, anchor_x, anchor_z, end_z, sway):
    # A wrapped eyelet seats each silk cord directly over the handle tube.
    torus(f"Tassel {label} {color} | attachment eyelet", 0.052, 0.009,
          anchor_z, BRIGHT_GOLD, x=side * anchor_x, y=-0.025,
          rotation=(0, math.pi / 2, 0))
    center_x = side * (anchor_x + 0.075)
    center_y = -0.12
    curve(f"Tassel {label} {color} | braided cord",
          [(side * anchor_x, -0.045, anchor_z),
           (side * (anchor_x + 0.025), -0.075, anchor_z - 0.10),
           (center_x, center_y, end_z + 0.18)], 0.015, mat, resolution=8)
    ribbon_top = anchor_z - 0.10
    ribbon_center_x = side * (anchor_x + 0.075 + sway)
    ribbon_tail(f"Tassel {label} {color} | broad silk ribbon", side,
                anchor_x, ribbon_top, end_z, sway, 0.14, mat, center_y)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=1,
                                         location=(center_x, center_y, ribbon_top - 0.015))
    cap = bpy.context.object
    cap.name = f"Tassel {label} {color} | gold ribbon ferrule"
    cap.scale = (0.052, 0.044, 0.055)
    assign(cap, BRIGHT_GOLD)
    for poly in cap.data.polygons:
        poly.use_smooth = True
    ribbon_fringe(f"Tassel {label} {color} | silk fringe",
                  side, ribbon_center_x, center_y, end_z, 0.14, mat)


def build_trophy():
    # Stacked black plinth with narrow polished reveal lines.
    cube("Plinth | broad foot", (0, 0, 0.16), (2.08, 1.22, 0.24), BLACK, 0.055)
    cube("Plinth | gold reveal", (0, 0, 0.295), (1.92, 1.08, 0.045), BRIGHT_GOLD, 0.012)
    cube("Plinth | main block", (0, 0, 0.57), (1.78, 0.98, 0.52), BLACK, 0.065)
    cube("Plinth | upper reveal", (0, 0, 0.84), (1.66, 0.9, 0.045), BRIGHT_GOLD, 0.012)
    cube("Plinth | cap", (0, 0, 0.97), (1.62, 0.86, 0.22), BLACK, 0.045)

    # Front plaque and engraved series naming.
    cube("Plaque | brass border", (0, -0.497, 0.59), (1.36, 0.035, 0.36), BRIGHT_GOLD, 0.018)
    cube("Plaque | dark enamel", (0, -0.518, 0.59), (1.30, 0.018, 0.30), PLAQUE, 0.01)
    cube("Plaque | crest bezel", (-0.47, -0.539, 0.59), (0.30, 0.026, 0.33), BRIGHT_GOLD, 0.014)
    crest_decal()
    # The official crest is the only mark on the front of the base.

    # Turned foot, collar and tapered central stem.
    lathe("Stem | flared foot", [(0.42, 1.07), (0.47, 1.10), (0.42, 1.16),
                                  (0.30, 1.22), (0.23, 1.34), (0.19, 1.46)], GOLD)
    torus("Stem | foot bead", 0.43, 0.026, 1.12, BRIGHT_GOLD)
    lathe("Stem | tapered column", [(0.19, 1.4), (0.15, 1.52), (0.105, 1.77),
                                     (0.12, 1.91), (0.20, 2.02), (0.26, 2.12),
                                     (0.24, 2.2)], GOLD)
    torus("Stem | lower collar", 0.2, 0.028, 1.48, BRIGHT_GOLD)
    torus("Stem | upper collar", 0.235, 0.03, 2.08, BRIGHT_GOLD)
    lathe("Stem | bowl socket", [(0.23, 2.12), (0.3, 2.16), (0.36, 2.22),
                                  (0.34, 2.29), (0.29, 2.32)], SHADOW_GOLD)
    torus("Stem | socket crown", 0.34, 0.035, 2.27, BRIGHT_GOLD)

    # Main cup: broad, gently flared, with real radial fluting and a rolled rim.
    outer = [(0.30, 2.20), (0.34, 2.25), (0.42, 2.34), (0.55, 2.53),
             (0.70, 2.78), (0.86, 3.05), (1.00, 3.32), (1.04, 3.43),
             (1.025, 3.47)]
    inner = [(0.93, 3.45), (0.92, 3.36), (0.82, 3.12), (0.68, 2.86),
             (0.54, 2.60), (0.40, 2.38), (0.29, 2.30)]
    lathe("Cup | fluted gold shell", outer + inner, GOLD, flutes=20, amplitude=0.025)
    torus("Cup | rolled polished rim", 0.985, 0.048, 3.455, BRIGHT_GOLD)
    torus("Cup | lower bead", 0.39, 0.035, 2.34, BRIGHT_GOLD)
    torus("Cup | upper fillet", 0.99, 0.018, 3.38, BRIGHT_GOLD)

    # Two swept, scroll-shaped handles with inset detailing and attachment bosses.
    handle = [(0.84, 0.0, 3.31), (1.03, 0.0, 3.57), (1.30, 0.0, 3.61),
              (1.48, 0.0, 3.43), (1.46, 0.0, 3.12), (1.28, 0.0, 2.85),
              (1.02, 0.0, 2.70), (0.83, 0.0, 2.77)]
    inner_handle = [(0.91, -0.012, 3.28), (1.08, -0.012, 3.47),
                    (1.28, -0.012, 3.49), (1.38, -0.012, 3.34),
                    (1.36, -0.012, 3.11), (1.22, -0.012, 2.92),
                    (1.01, -0.012, 2.82)]
    for side, label in ((1, "R"), (-1, "L")):
        curve(f"Handle {label} | sculpted scroll", [(x * side, y, z) for x, y, z in handle], 0.062, BRIGHT_GOLD)
        curve(f"Handle {label} | inset tracer", [(x * side, y, z) for x, y, z in inner_handle], 0.013, SHADOW_GOLD)
        for z, x in ((3.31, 0.84), (2.77, 0.83)):
            bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16,
                                                  radius=0.105, location=(side * x, 0, z))
            boss = bpy.context.object
            boss.name = f"Handle {label} | attachment boss"
            boss.scale = (1.0, 0.72, 1.0)
            assign(boss, GOLD)
            for poly in boss.data.polygons:
                poly.use_smooth = True
            torus(f"Handle {label} | boss bead", 0.073, 0.012, z, BRIGHT_GOLD,
                  x=side * x, y=-0.064, rotation=(math.pi / 2, 0, 0))
        # Red, green, and yellow silk tassels hang from both handle scrolls.
        for color, mat, x, z, tip, sway in (
            ("red", TASSEL_RED, 1.04, 3.53, 2.57, -0.035),
            ("green", TASSEL_GREEN, 1.27, 3.58, 2.48, 0.008),
            ("yellow", TASSEL_YELLOW, 1.44, 3.43, 2.56, 0.042),
        ):
            handle_tassel(side, label, color, mat, x, z, tip, sway)


def setup_studio():
    # Render-only stage is excluded from the selected-object GLB export.
    cube("STUDIO ONLY | matte ground", (0, 0, -0.025), (200, 200, 0.05), FLOOR, 0)
    bpy.ops.object.camera_add(location=(5.8, -9.5, 5.5))
    camera = bpy.context.object
    camera.name = "STUDIO ONLY | portrait camera"
    target = Vector((0, 0, 1.93))
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 5.45
    bpy.context.scene.camera = camera

    def area(name, location, energy, color, size, target_point):
        bpy.ops.object.light_add(type="AREA", location=location)
        light = bpy.context.object
        light.name = "STUDIO ONLY | " + name
        light.data.energy = energy
        light.data.color = color
        light.data.shape = "DISK"
        light.data.size = size
        light.rotation_euler = (Vector(target_point) - light.location).to_track_quat("-Z", "Y").to_euler()

    area("warm key", (3.5, -4.0, 7.0), 780, (1.0, 0.77, 0.43), 4.0, (0, 0, 2))
    area("cool fill", (-4.2, -2.5, 4.2), 560, (0.48, 0.68, 1.0), 3.5, (0, 0, 2))
    area("gold rim", (0.5, 3.2, 5.8), 1050, (1.0, 0.58, 0.2), 3.0, (0, 0, 2.5))

    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 96
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 1200
    scene.render.resolution_y = 1500
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    scene.world.color = (0.035, 0.045, 0.065)
    scene.view_settings.view_transform = "AgX"
    scene.render.filepath = os.path.join(OUT, "trophy-frontier-preview.png")


def export_model():
    scene = bpy.context.scene
    scene.render.filepath = os.path.join(OUT, "trophy-frontier-preview.png")
    bpy.ops.render.render(write_still=True)

    # Keep stage, camera, and lights in the editable .blend but out of the GLB.
    bpy.ops.object.select_all(action="DESELECT")
    for obj in scene.objects:
        if not obj.name.startswith("STUDIO ONLY | "):
            obj.select_set(True)
    bpy.context.view_layer.objects.active = next(obj for obj in scene.objects if obj.name.startswith("Cup | fluted gold shell"))

    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "trophy-frontier.blend"))

    # The editable source keeps individual components. The runtime copy joins
    # each shared material into one primitive to reduce rendering submissions.
    model_objects = [obj for obj in scene.objects if not obj.name.startswith("STUDIO ONLY | ")]
    bpy.ops.object.select_all(action="DESELECT")
    for obj in model_objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = model_objects[0]
    bpy.ops.object.convert(target="MESH")
    material_groups = {}
    for obj in [o for o in scene.objects if o.select_get()]:
        key = obj.data.materials[0].name if obj.data.materials else "Unassigned"
        material_groups.setdefault(key, []).append(obj)
    for key, objects in material_groups.items():
        bpy.ops.object.select_all(action="DESELECT")
        for obj in objects:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = objects[0]
        if len(objects) > 1:
            bpy.ops.object.join()
        bpy.context.view_layer.objects.active.name = "Trophy | " + key

    bpy.ops.object.select_all(action="DESELECT")
    for obj in scene.objects:
        if not obj.name.startswith("STUDIO ONLY | "):
            obj.select_set(True)
    bpy.context.view_layer.objects.active = next(obj for obj in scene.objects if obj.name.startswith("Trophy | "))
    bpy.ops.export_scene.gltf(
        filepath=os.path.join(OUT, "trophy-frontier.glb"),
        export_format="GLB",
        export_apply=True,
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
        export_animations=False,
        use_selection=True,
    )
    # Build the site copy with Meshopt geometry compression without adding a
    # project dependency.
    bpy.ops.export_scene.gltf(
        filepath=os.path.join(OUT, "trophy-frontier.web.glb"),
        export_format="GLB",
        export_apply=True,
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
        export_animations=False,
        export_meshopt_compression_enable=True,
        use_selection=True,
    )


if __name__ == "__main__":
    clear_scene()
    build_trophy()
    setup_studio()
    export_model()
    print("FRONTIER_TROPHY_DONE")
