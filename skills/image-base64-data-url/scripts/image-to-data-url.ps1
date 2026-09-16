param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$InputPath,
    [string]$OutputPath,
    [string]$MimeType
)

$ErrorActionPreference = 'Stop'
$resolvedInput = (Resolve-Path -LiteralPath $InputPath).Path

if (-not $MimeType) {
    $mimeTypes = @{
        '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
        '.gif' = 'image/gif'; '.webp' = 'image/webp'; '.svg' = 'image/svg+xml'
        '.bmp' = 'image/bmp'; '.ico' = 'image/x-icon'; '.avif' = 'image/avif'
        '.tif' = 'image/tiff'; '.tiff' = 'image/tiff'
    }
    $extension = [IO.Path]::GetExtension($resolvedInput).ToLowerInvariant()
    $MimeType = $mimeTypes[$extension]
    if (-not $MimeType) { throw "Unsupported image extension '$extension'. Pass -MimeType to override." }
}

if ($MimeType -notmatch '^image/[A-Za-z0-9.+-]+$') { throw 'MimeType must be an image MIME type, such as image/png.' }

$base64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($resolvedInput))
$dataUrl = "data:$MimeType;base64,$base64"

if ($OutputPath) {
    $fullOutput = [IO.Path]::GetFullPath($OutputPath)
    $parent = [IO.Path]::GetDirectoryName($fullOutput)
    if ($parent -and -not [IO.Directory]::Exists($parent)) { [IO.Directory]::CreateDirectory($parent) | Out-Null }
    [IO.File]::WriteAllText($fullOutput, $dataUrl, [Text.UTF8Encoding]::new($false))
    Write-Output $fullOutput
} else {
    Write-Output $dataUrl
}
