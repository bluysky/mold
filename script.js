<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mold Tracking</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        /* ... (기존 스타일) ... */
    </style>
</head>
<body class="container mt-4">
    <h2 class="text-center">Mold Tracking System</h2>
    <button onclick="toggleLanguage()" class="btn btn-secondary mb-3">Switch to Korean</button>
    <form id="moldForm">
        <div class="mb-3">
            <label for="moldType" class="form-label lang">Mold ID</label>
            <select id="moldType" class="form-select">
                <option value="MEB">MEB</option>
                <option value="E603C">E603C</option>
            </select>
            <label for="moldCategory" class="form-label lang">Mold Category</label>
            <select id="moldCategory" class="form-select">
                <option value="CA">CA</option>
                <option value="AN">AN</option>
            </select>
            <input type="text" id="moldNumber" class="form-control mt-2" placeholder="Enter Number">
        </div>
        <div class="mb-3">
            <label for="moldStatus" class="form-label lang">Mold Status</label>
            <select id="moldStatus" class="form-select">
                <option value="Received">Received</option>
                <option value="Shipped">Shipped</option>
            </select>
            <input type="date" id="statusDate" class="form-control mt-2">
        </div>
        <div class="mb-3">
            <label for="inspectionStatus" class="form-label lang">Inspection Status</label>
            <input type="text" id="inspectionStatus" class="form-control">
        </div>
        <div class="mb-3">
            <label for="inspector" class="form-label lang">Inspector</label>
            <input type="text" id="inspector" class="form-control">
        </div>
        <button type="button" class="btn btn-primary" onclick="saveMold()">Save</button>
        <button type="button" class="btn btn-success" onclick="fetchMolds()">Fetch</button>
        <input type="hidden" id="editId">
    </form>
    <table class="table mt-4">
        <thead>
            <tr>
                <th>ID</th>
                <th class="lang">Mold</th>
                <th class="lang">Status</th>
                <th class="lang">Inspection Status</th>
                <th class="lang">Inspector</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="moldTable">
            </tbody>
    </table>
    <div id="deleteModal
