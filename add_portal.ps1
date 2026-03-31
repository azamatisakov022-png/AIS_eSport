# Add Portal import and wrap overlay divs
$dir = 'src/pages'
$importLine = "import Portal from '../components/Portal'"
$files = Get-ChildItem -Path $dir -Filter '*.jsx' -Recurse

foreach ($f in $files) {
    $lines = Get-Content $f.FullName
    if (-not ($lines -match 'drawer-overlay|modal-overlay')) { continue }
    if ($lines -match "from '../components/Portal'") { Write-Host "SKIP: $($f.Name)"; continue }
    
    $result = @()
    $needsImport = $true
    $portalDepth = 0  # track how many <Portal> we opened without closing
    $divBalance = 0   # div open/close balance inside portal block
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        
        # Add import after CSS import
        if ($needsImport -and $line -match "^import './$([System.IO.Path]::GetFileNameWithoutExtension($f.Name))\.css'") {
            $result += $line
            $result += $importLine
            $needsImport = $false
            continue
        }
        
        # Detect overlay div opening - add <Portal> wrapper
        if ($line -match '<div className="[a-z]+-(?:drawer|modal)-overlay"') {
            $indent = $line -replace '(\s*).*', '$1'
            $result += "${indent}<Portal>"
            $result += $line
            $portalDepth++
            $divBalance = 1  # we just opened one div
            continue
        }
        
        # Track div balance when inside portal
        if ($portalDepth -gt 0) {
            # Count <div opens (not self-closing)
            $opens = ([regex]::Matches($line, '<div[\s>]')).Count
            $closes = ([regex]::Matches($line, '</div>')).Count
            $divBalance += $opens - $closes
            
            # When divBalance reaches 0, the overlay div is closed - add </Portal>
            if ($divBalance -le 0) {
                $result += $line
                $indent = $line -replace '(\s*).*', '$1'
                $result += "${indent}</Portal>"
                $portalDepth--
                $divBalance = 0
                continue
            }
        }
        
        $result += $line
    }
    
    $content = $result -join "`r`n"
    Set-Content $f.FullName $content -NoNewline
    Write-Host "Updated: $($f.Name)"
}
