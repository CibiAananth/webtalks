<?php
/**
 * ============================================================
 * SESSION 1 DEMO: How websites worked before JavaScript
 * ============================================================
 *
 * This is a complete web application in a SINGLE FILE.
 *
 * Notice:
 * - The server handles EVERYTHING: reading data, processing
 *   forms, rendering HTML
 * - There is ZERO JavaScript on this page
 * - Every interaction (adding a user, deleting a user) causes
 *   a FULL PAGE RELOAD
 * - The browser is just a "dumb display" — it shows whatever
 *   HTML the server sends
 *
 * Run with: docker run --rm -p 8080:80 -v $(pwd):/var/www/html php:8.2-apache
 * Then open: http://localhost:8080
 */

// ============================================================
// "DATABASE" — In real apps this would be MySQL/PostgreSQL
// We're using a JSON file to keep the demo self-contained
// ============================================================

$DB_FILE = __DIR__ . '/users.json';

function readUsers(string $dbFile): array {
    if (!file_exists($dbFile)) {
        // Seed with some initial users
        $initial = [
            [
                'id' => 1,
                'name' => 'Priya Sharma',
                'email' => 'priya@example.com',
                'role' => 'Frontend Engineer',
                'joined' => '2023-03-15'
            ],
            [
                'id' => 2,
                'name' => 'Rahul Mehta',
                'email' => 'rahul@example.com',
                'role' => 'Backend Engineer',
                'joined' => '2023-06-01'
            ],
            [
                'id' => 3,
                'name' => 'Ananya Reddy',
                'email' => 'ananya@example.com',
                'role' => 'Product Manager',
                'joined' => '2024-01-10'
            ],
        ];
        file_put_contents($dbFile, json_encode($initial, JSON_PRETTY_PRINT));
        return $initial;
    }
    return json_decode(file_get_contents($dbFile), true) ?? [];
}

function saveUsers(string $dbFile, array $users): void {
    file_put_contents($dbFile, json_encode($users, JSON_PRETTY_PRINT));
}

// ============================================================
// HANDLE FORM SUBMISSIONS
// ============================================================
//
// This is the key thing to understand:
// When a user clicks "Add User" or "Delete", the browser sends
// a POST request to THIS SAME FILE. PHP processes it, modifies
// the data, then REDIRECTS back to this page with a GET request.
//
// This is called the POST-Redirect-GET pattern.
// The full page reloads every time. There's no way around it.
// ============================================================

$message = '';
$messageType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $users = readUsers($DB_FILE);

    // --- Handle "Add User" form ---
    if (isset($_POST['action']) && $_POST['action'] === 'add_user') {
        $name  = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $role  = trim($_POST['role'] ?? '');

        // Server-side validation — there's no client-side validation!
        // The form data travels to the server, gets validated there,
        // and if it fails, the server sends back the whole page with
        // an error message. The user loses their form input.
        $errors = [];
        if (empty($name))  $errors[] = 'Name is required';
        if (empty($email)) $errors[] = 'Email is required';
        if (empty($role))  $errors[] = 'Role is required';
        if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Invalid email format';
        }

        // Check for duplicate email
        foreach ($users as $u) {
            if ($u['email'] === $email) {
                $errors[] = 'Email already exists';
                break;
            }
        }

        if (empty($errors)) {
            $newId = empty($users) ? 1 : max(array_column($users, 'id')) + 1;
            $users[] = [
                'id' => $newId,
                'name' => $name,
                'email' => $email,
                'role' => $role,
                'joined' => date('Y-m-d'),
            ];
            saveUsers($DB_FILE, $users);

            // POST-Redirect-GET: redirect to avoid duplicate submission on refresh
            header('Location: index.php?msg=added');
            exit;
        } else {
            $message = implode(', ', $errors);
            $messageType = 'error';
        }
    }

    // --- Handle "Delete User" ---
    if (isset($_POST['action']) && $_POST['action'] === 'delete_user') {
        $deleteId = (int)($_POST['user_id'] ?? 0);
        $users = array_values(array_filter($users, fn($u) => $u['id'] !== $deleteId));
        saveUsers($DB_FILE, $users);

        // Again: redirect after POST
        header('Location: index.php?msg=deleted');
        exit;
    }
}

// Handle success messages from redirects
if (isset($_GET['msg'])) {
    if ($_GET['msg'] === 'added') {
        $message = 'User added successfully!';
        $messageType = 'success';
    } elseif ($_GET['msg'] === 'deleted') {
        $message = 'User deleted.';
        $messageType = 'success';
    }
}

// ============================================================
// READ DATA — This happens on every single page load
// ============================================================
//
// In PHP + MySQL, this would be:
//   $result = $db->query("SELECT * FROM users ORDER BY joined DESC");
//
// Every page load = a fresh database query. There's no caching,
// no stale data, no "refetch on window focus." The data is always
// current because you always ask the database.
// ============================================================

$users = readUsers($DB_FILE);
$totalUsers = count($users);

// ============================================================
// RENDER HTML — PHP mixes data directly into the markup
// ============================================================
//
// This is the part that feels weird if you're used to React.
// There's no separation of "data layer" and "view layer."
// The server fetches data and renders HTML in the same breath.
//
// The browser receives finished HTML. It doesn't need to:
// - Download a JS bundle
// - Parse and execute React
// - Make API calls
// - Wait for responses
// - Then render
//
// It just... shows the page. Instantly.
// ============================================================
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Directory — PHP Demo (No JavaScript!)</title>

    <!--
        Notice: there is NO JavaScript anywhere on this page.
        No <script> tags. No event listeners. No fetch() calls.
        Everything is server-rendered HTML + CSS.
    -->

    <style>
        /* ---- All styling is plain CSS. No Tailwind, no CSS-in-JS. ---- */
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
        }

        header {
            background: #1a1a2e;
            color: white;
            padding: 2rem;
            margin-bottom: 2rem;
            border-radius: 8px;
        }

        header h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }

        .subtitle {
            color: #8888aa;
            font-size: 0.9rem;
        }

        .banner {
            background: #fff3cd;
            border: 2px dashed #ffc107;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            font-size: 0.9rem;
            color: #664d03;
        }

        .banner strong { color: #cc8800; }

        /* Messages */
        .message {
            padding: 1rem;
            border-radius: 6px;
            margin-bottom: 1.5rem;
            font-weight: 500;
        }
        .message.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .message.error   { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }

        /* Stats */
        .stats {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            flex: 1;
            text-align: center;
        }
        .stat-card .number { font-size: 2rem; font-weight: 700; color: #1a1a2e; }
        .stat-card .label  { font-size: 0.85rem; color: #666; margin-top: 0.25rem; }

        /* Two column layout */
        .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            align-items: start;
        }

        /* User list */
        .user-list {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .user-list h2 {
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid #eee;
            font-size: 1.1rem;
        }
        .user-card {
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .user-card:last-child { border-bottom: none; }
        .user-info h3 { font-size: 1rem; margin-bottom: 0.2rem; }
        .user-info .email { font-size: 0.85rem; color: #666; }
        .user-info .meta  { font-size: 0.8rem; color: #999; margin-top: 0.3rem; }

        /* Delete button — it's inside a <form>! Not an onClick handler! */
        .delete-form button {
            background: none;
            border: 1px solid #dc3545;
            color: #dc3545;
            padding: 0.4rem 0.8rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.2s;
        }
        .delete-form button:hover {
            background: #dc3545;
            color: white;
        }

        /* Add user form */
        .add-form-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .add-form-container h2 {
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid #eee;
            font-size: 1.1rem;
        }
        .add-form {
            padding: 1.5rem;
        }
        .form-group {
            margin-bottom: 1.25rem;
        }
        .form-group label {
            display: block;
            font-weight: 600;
            margin-bottom: 0.4rem;
            font-size: 0.9rem;
        }
        .form-group input, .form-group select {
            width: 100%;
            padding: 0.6rem 0.8rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 0.95rem;
        }
        .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: #1a1a2e;
            box-shadow: 0 0 0 2px rgba(26,26,46,0.1);
        }
        .submit-btn {
            background: #1a1a2e;
            color: white;
            border: none;
            padding: 0.7rem 1.5rem;
            border-radius: 4px;
            font-size: 0.95rem;
            cursor: pointer;
            width: 100%;
            transition: background 0.2s;
        }
        .submit-btn:hover { background: #16213e; }

        .timestamp {
            text-align: center;
            color: #999;
            font-size: 0.8rem;
            margin-top: 2rem;
            padding: 1rem;
        }

        .empty-state {
            padding: 2rem;
            text-align: center;
            color: #999;
        }

        @media (max-width: 700px) {
            .content-grid { grid-template-columns: 1fr; }
            .stats { flex-direction: column; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📋 Team Directory</h1>
            <p class="subtitle">
                Server-rendered with PHP · No JavaScript · Every click = full page reload
            </p>
        </header>

        <div class="banner">
            <strong>🔍 Workshop Note:</strong> Open your browser's DevTools → Network tab.
            Watch what happens when you add or delete a user. You'll see a full page
            reload every time — the browser sends a request, the server processes it,
            and sends back an <em>entirely new HTML page</em>.
        </div>

        <?php if ($message): ?>
            <div class="message <?= $messageType ?>">
                <?= htmlspecialchars($message) ?>
            </div>
        <?php endif; ?>

        <div class="stats">
            <div class="stat-card">
                <div class="number"><?= $totalUsers ?></div>
                <div class="label">Team Members</div>
            </div>
            <div class="stat-card">
                <!--
                    This count is computed on the server, on every page load.
                    In React, you'd derive this from state. Here, it's just PHP.
                -->
                <div class="number">
                    <?= count(array_filter($users, fn($u) => str_contains($u['role'], 'Engineer'))) ?>
                </div>
                <div class="label">Engineers</div>
            </div>
            <div class="stat-card">
                <div class="number">
                    <?= count(array_filter($users, fn($u) => $u['joined'] >= '2024-01-01')) ?>
                </div>
                <div class="label">Joined in 2024+</div>
            </div>
        </div>

        <div class="content-grid">
            <!-- LEFT: User List -->
            <div class="user-list">
                <h2>All Members</h2>

                <?php if (empty($users)): ?>
                    <div class="empty-state">
                        No team members yet. Add one using the form →
                    </div>
                <?php else: ?>
                    <?php foreach ($users as $user): ?>
                        <!--
                            Each user card is rendered by PHP in a loop.
                            This is the equivalent of users.map(user => <UserCard />)
                            in React — except it happens on the server, and the
                            browser just gets the finished HTML.
                        -->
                        <div class="user-card">
                            <div class="user-info">
                                <h3><?= htmlspecialchars($user['name']) ?></h3>
                                <div class="email"><?= htmlspecialchars($user['email']) ?></div>
                                <div class="meta">
                                    <?= htmlspecialchars($user['role']) ?> ·
                                    Joined <?= date('M j, Y', strtotime($user['joined'])) ?>
                                </div>
                            </div>

                            <!--
                                THIS IS THE KEY DIFFERENCE FROM REACT:

                                In React, you'd do:
                                    <button onClick={() => deleteUser(user.id)}>Delete</button>

                                In PHP, the delete button is a FORM that submits to the server.
                                Clicking "Delete" sends a POST request with the user ID.
                                The server deletes the user, then redirects back here.
                                The browser loads the entire page again.

                                There's no way to delete a user without a full page reload.
                            -->
                            <form method="POST" action="index.php" class="delete-form">
                                <input type="hidden" name="action" value="delete_user">
                                <input type="hidden" name="user_id" value="<?= $user['id'] ?>">
                                <button type="submit">Delete</button>
                            </form>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <!-- RIGHT: Add User Form -->
            <div class="add-form-container">
                <h2>Add Team Member</h2>

                <!--
                    This form submits to the SAME page via POST.

                    Notice: there's no client-side validation.
                    No "field is required" tooltip. No red border on empty fields.
                    The user fills in the form, clicks submit, the data goes to
                    the server, and if validation fails, the ENTIRE page reloads
                    with an error message.

                    Worse: the form fields are now EMPTY because the page reloaded.
                    The user has to type everything again.

                    This was the normal experience until JavaScript form validation
                    became common around 2008-2010.
                -->
                <form method="POST" action="index.php" class="add-form">
                    <input type="hidden" name="action" value="add_user">

                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" name="name"
                               placeholder="e.g. Vikram Patel">
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email"
                               placeholder="e.g. vikram@example.com">
                    </div>

                    <div class="form-group">
                        <label for="role">Role</label>
                        <select id="role" name="role">
                            <option value="">Select a role...</option>
                            <option value="Frontend Engineer">Frontend Engineer</option>
                            <option value="Backend Engineer">Backend Engineer</option>
                            <option value="Full Stack Engineer">Full Stack Engineer</option>
                            <option value="Product Manager">Product Manager</option>
                            <option value="Designer">Designer</option>
                            <option value="Engineering Manager">Engineering Manager</option>
                        </select>
                    </div>

                    <button type="submit" class="submit-btn">
                        Add Member
                    </button>
                </form>
            </div>
        </div>

        <div class="timestamp">
            <!--
                This timestamp proves the page is freshly rendered on each load.
                Refresh the page — the timestamp changes every time.
                In a React SPA, the timestamp would only change if you
                explicitly re-rendered the component.
            -->
            Page rendered at: <?= date('Y-m-d H:i:s') ?> (server time)
            · PHP <?= PHP_VERSION ?>
        </div>
    </div>
</body>
</html>
